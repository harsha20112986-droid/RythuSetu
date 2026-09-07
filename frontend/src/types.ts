const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return `${envUrl.trim().replace(/\/+$/, "")}/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

export const API_BASE = getApiBase();

export type Page = "home" | "onboarding" | "dashboard" | "schemes" | "benefits" | "loss" | "doctor" | "admin" | "mandi" | "fertilizer";

export type FormState = {
  name: string;
  language: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  crop: string;
  season: string;
  land_area_acres: string;
};

export type Farmer = {
  id: number;
  form: FormState;
};

export type Scheme = {
  id: string;
  name: string;
  category: string;
  scope: string;
  icon: string;
  summary: string;
  benefit: string;
  eligibility_note: string;
  official_url: string;
  last_verified: string;
  match_label: string;
  reasons: string[];
};

export type BenefitItem = {
  id: string;
  name: string;
  category: string;
  type: string;
  estimated_amount: number | null;
  calculation: string;
  basis: string;
  official_url: string;
  last_verified: string;
};

export type BenefitData = {
  estimated_total: number;
  items: BenefitItem[];
  disclaimer: string;
};

export type LossReport = {
  id: number;
  crop: string;
  damage_type: string;
  loss_date: string;
  affected_area_acres: number;
  damage_percent: number;
  description: string;
  evidence_filename: string | null;
  status: string;
  submitted_at: string;
  next_step: string;
};

export type ClimateData = {
  location: {
    name: string;
    state?: string | null;
    latitude: number;
    longitude: number;
  };
  current: {
    time: string;
    temperature_c: number;
    apparent_temperature_c: number;
    humidity_percent: number;
    precipitation_mm: number;
    wind_speed_kmh: number;
    wind_gust_kmh: number;
    weather_code: number;
  };
  today_forecast: {
    date: string;
    max_temperature_c: number;
    rain_probability_percent: number;
    precipitation_sum_mm: number;
    max_wind_gust_kmh: number;
  };
  risk: {
    level: string;
    score: number;
    factors: string[];
    suggested_action: string;
  };
  profile_context: {
    crop: string;
    season: string;
    district: string;
    state: string;
  };
  source: string;
  disclaimer: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
};

export const states = ["Andhra Pradesh", "Telangana"];

export const districts: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Kurnool", "Guntur", "Krishna", "West Godavari", "Chittoor"],
  Telangana: ["Warangal", "Nizamabad", "Karimnagar", "Hyderabad", "Nalgonda", "Khammam"],
};

export const cropOptions = [
  { name: "Cotton", tag: "Cash Crop", key: "cotton" },
  { name: "Groundnut", tag: "Oilseed", key: "groundnut" },
  { name: "Rice", tag: "Paddy / Grain", key: "rice" },
  { name: "Maize", tag: "Coarse Grain", key: "maize" },
  { name: "Chilli", tag: "Commercial Spice", key: "chilli" },
  { name: "Pigeon Pea", tag: "Pulses / Red Gram", key: "pulses" },
];

export const seasons = [
  { name: "Kharif", desc: "Monsoon Season (Jun - Oct)", tag: "Rainfed / Major" },
  { name: "Rabi", desc: "Winter Season (Oct - Mar)", tag: "Irrigated / Post-Monsoon" },
  { name: "Summer", desc: "Zaid Season (Mar - Jun)", tag: "Early Crop" },
];

export const damageTypes = [
  "Flood / Heavy Rain",
  "Drought / Heat Wave",
  "Pest Attack",
  "Crop Disease",
  "Hailstorm / High Wind",
  "Other Unseasonal Damage",
];

export const REGIONAL_PROFILES: { label: string; stateLabel: string; farmer: Farmer }[] = [
  {
    label: "Kishan Rao",
    stateLabel: "Telangana \u2022 Cotton (3.5 ac)",
    farmer: {
      id: 101,
      form: {
        name: "Kishan Rao",
        language: "Telugu",
        state: "Telangana",
        district: "Warangal",
        mandal: "Narsampet",
        village: "Chennaraopet",
        crop: "Cotton",
        season: "Kharif",
        land_area_acres: "3.5",
      },
    },
  },
  {
    label: "Lakshmi Devi",
    stateLabel: "Andhra Pradesh \u2022 Groundnut (2.5 ac)",
    farmer: {
      id: 102,
      form: {
        name: "Lakshmi Devi",
        language: "Telugu",
        state: "Andhra Pradesh",
        district: "Anantapur",
        mandal: "Dharmavaram",
        village: "Marala",
        crop: "Groundnut",
        season: "Kharif",
        land_area_acres: "2.5",
      },
    },
  },
  {
    label: "Ramesh Goud",
    stateLabel: "Telangana \u2022 Rice (4.0 ac)",
    farmer: {
      id: 103,
      form: {
        name: "Ramesh Goud",
        language: "Hindi",
        state: "Telangana",
        district: "Karimnagar",
        mandal: "Huzurabad",
        village: "Bornapalli",
        crop: "Rice",
        season: "Kharif",
        land_area_acres: "4.0",
      },
    },
  },
];

export type DiseaseAnalysis = {
  crop: string;
  disease_name: string;
  confidence_percent: number;
  severity: string;
  symptoms: string[];
  organic_treatment: string;
  chemical_treatment: string;
  pmfby_coverage: string;
  advisory: string;
  engine: string;
};

export type ClaimStage = {
  step: number;
  title: string;
  status: string;
  date: string;
  detail: string;
};

export type ClaimPacket = {
  reference_number: string;
  scheme: string;
  generated_at: string;
  farmer: {
    name: string;
    state: string;
    district: string;
    mandal: string;
    village: string;
    khata_survey_no: string;
    bank_account_verified: boolean;
    aadhaar_ekyc_status: string;
  };
  crop_details: {
    crop: string;
    season: string;
    total_land_acres: number;
    affected_acres: number;
    damage_percent: number;
    damage_type: string;
    incident_date: string;
  };
  financial_valuation: {
    scale_of_finance_per_acre: number;
    estimated_eligible_payout: number;
    payout_currency: string;
  };
  required_documents_checklist: { doc: string; status: string }[];
  lifecycle_stages: ClaimStage[];
  official_disclaimer: string;
};


export type UserRole = "farmer" | "admin";

export type AuthUser = {
  username: string;
  name: string;
  role: UserRole;
  designation?: string;
  district?: string;
  state?: string;
  farmer_profile_id?: number | null;
};

export type AdminStats = {
  total_farmers: number;
  active_districts: number;
  total_claims: number;
  pending_verification: number;
  approved_claims: number;
  dbt_disbursed: number;
  total_relief_amount: number;
  weather_alerts_active: number;
};

export type AdminClaimItem = {
  claim_id: string;
  farmer_id: number;
  farmer_name: string;
  phone: string;
  village: string;
  district: string;
  crop_name: string;
  loss_cause: string;
  loss_percentage: number;
  estimated_loss_inr: number;
  current_stage: number;
  stage_name: string;
  filed_at: string;
  evidence_photo: string;
};

export type BroadcastAlert = {
  id: string;
  timestamp: string;
  title: string;
  severity: "high" | "moderate" | "critical";
  target_crop: string;
  district: string;
  advisory: string;
  issued_by: string;
};


export type MandiMarketItem = {
  mandi_name: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  msp_benchmark: number;
  arrival_quintals: number;
  price_trend: "bullish" | "bearish" | "stable";
  trend_percent: number;
  recommendation: string;
  verified_date: string;
};

export type MandiData = {
  crop: string;
  govt_msp_inr: number;
  average_modal_price: number;
  msp_difference_inr: number;
  msp_status: string;
  markets: MandiMarketItem[];
  source: string;
  timestamp: string;
};

export type FertilizerStage = {
  stage_name: string;
  timing: string;
  urea_kg: number;
  dap_kg: number;
  mop_potash_kg: number;
  micronutrients: string;
  notes: string;
};

export type FertilizerPlan = {
  crop: string;
  soil_type: string;
  acres: number;
  soil_profile: {
    retention: string;
    drainage: string;
    organic_carbon: string;
    ph_range: string;
    caution: string;
  };
  total_bag_requirements: {
    urea_45kg_bags: number;
    dap_50kg_bags: number;
    mop_potash_50kg_bags: number;
    zinc_sulphate_kg: number;
  };
  growth_stages_schedule: FertilizerStage[];
  organic_alternatives: string[];
  soil_health_advisory: string;
};
