from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"


def _get_json(url: str) -> dict:
    request = Request(url, headers={"User-Agent": "RythuSetu/0.7"})
    with urlopen(request, timeout=12) as response:
        return json.loads(response.read().decode("utf-8"))


def _geocode(district: str, state: str) -> dict:
    params = urlencode(
        {
            "name": f"{district}, {state}",
            "count": 1,
            "language": "en",
            "countryCode": "IN",
            "format": "json",
        }
    )
    data = _get_json(f"{GEOCODING_URL}?{params}")
    results = data.get("results", [])
    if not results:
        raise ValueError("Could not locate this district for weather data")
    return results[0]


def _score_risk(temperature: float, rain_probability: float, wind_gust: float, precipitation: float, crop: str) -> tuple[str, int, list[str]]:
    score = 0
    factors: list[str] = []

    if temperature >= 38:
        score += 3
        factors.append("High heat exposure")
    elif temperature >= 35:
        score += 2
        factors.append("Elevated heat exposure")
    elif temperature >= 32:
        score += 1
        factors.append("Warm conditions")

    if rain_probability >= 70:
        score += 2
        factors.append("High chance of rain")
    elif rain_probability >= 50:
        score += 1
        factors.append("Moderate chance of rain")

    if precipitation >= 25:
        score += 2
        factors.append("Heavy forecast precipitation")
    elif precipitation >= 10:
        score += 1
        factors.append("Meaningful forecast precipitation")

    if wind_gust >= 50:
        score += 2
        factors.append("Strong wind gusts")
    elif wind_gust >= 35:
        score += 1
        factors.append("Elevated wind gusts")

    # Rice is especially sensitive to waterlogging, while these crops can be heat-sensitive.
    crop_lower = crop.lower()
    if crop_lower == "rice" and precipitation >= 25:
        score += 1
        factors.append("Rice field waterlogging risk")

    if score >= 6:
        level = "High"
    elif score >= 3:
        level = "Moderate"
    else:
        level = "Low"

    return level, score, factors


def get_climate_risk(*, state: str, district: str, crop: str, season: str) -> dict:
    location = _geocode(district, state)

    params = urlencode(
        {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m",
            "daily": "temperature_2m_max,precipitation_probability_max,precipitation_sum,wind_gusts_10m_max",
            "forecast_days": 3,
            "timezone": "auto",
            "temperature_unit": "celsius",
            "wind_speed_unit": "kmh",
            "precipitation_unit": "mm",
        }
    )
    weather = _get_json(f"{FORECAST_URL}?{params}")
    current = weather.get("current", {})
    daily = weather.get("daily", {})

    temperature = float(current.get("temperature_2m", 0))
    rain_probability = float((daily.get("precipitation_probability_max") or [0])[0])
    precipitation = float((daily.get("precipitation_sum") or [0])[0])
    wind_gust = float(current.get("wind_gusts_10m", 0))

    level, score, factors = _score_risk(
        temperature, rain_probability, wind_gust, precipitation, crop
    )

    if level == "High":
        action = "Take extra precautions and check crop conditions frequently."
    elif level == "Moderate":
        action = "Monitor crop moisture and weather changes closely today."
    else:
        action = "Conditions look relatively stable; continue normal field monitoring."

    return {
        "location": {
            "name": location.get("name", district),
            "district": district,
            "state": state,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "timezone": location.get("timezone"),
        },
        "current": {
            "time": current.get("time"),
            "temperature_c": temperature,
            "apparent_temperature_c": current.get("apparent_temperature"),
            "humidity_percent": current.get("relative_humidity_2m"),
            "precipitation_mm": current.get("precipitation"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
            "wind_gust_kmh": wind_gust,
            "weather_code": current.get("weather_code"),
        },
        "today_forecast": {
            "date": (daily.get("time") or [None])[0],
            "max_temperature_c": (daily.get("temperature_2m_max") or [None])[0],
            "rain_probability_percent": rain_probability,
            "precipitation_sum_mm": precipitation,
            "max_wind_gust_kmh": (daily.get("wind_gusts_10m_max") or [None])[0],
        },
        "risk": {
            "level": level,
            "score": score,
            "factors": factors,
            "suggested_action": action,
        },
        "profile_context": {"crop": crop, "season": season},
        "source": {
            "provider": "Open-Meteo",
            "weather_url": FORECAST_URL,
            "geocoding_url": GEOCODING_URL,
            "attribution": "Weather data provided by Open-Meteo",
        },
        "disclaimer": "RythuSetu's risk level is an informational heuristic based on forecast weather signals. It is not an official weather warning, crop-loss assessment, or disaster declaration.",
    }
