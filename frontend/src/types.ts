const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return `${envUrl.trim().replace(/\/+$/, "")}/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

export const API_BASE = getApiBase();

export type Page = "home" | "onboarding" | "dashboard" | "schemes" | "benefits" | "loss" | "doctor" | "admin" | "mandi" | "fertilizer" | "recommendation" | "storage" | "factory";

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

export type HourlyForecastItem = {
  time: string;
  temperature_c: number;
  rain_probability_percent: number;
  weather_code: number;
  condition_text: string;
  icon: string;
};

export type DailyForecastItem = {
  date: string;
  day_name: string;
  min_temperature_c: number;
  max_temperature_c: number;
  rain_probability_percent: number;
  precipitation_sum_mm: number;
  weather_code: number;
  condition_text: string;
  icon: string;
  uv_index: number;
};

export type ClimateData = {
  location: {
    name: string;
    district?: string;
    headquarters?: string;
    telugu_name?: string;
    state?: string | null;
    latitude: number;
    longitude: number;
    source_type?: string;
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
    condition_text?: string;
    icon?: string;
    cloud_cover_percent?: number;
  };
  today_forecast: {
    date: string;
    min_temperature_c?: number;
    max_temperature_c: number;
    rain_probability_percent: number;
    precipitation_sum_mm: number;
    max_wind_gust_kmh: number;
    condition_text?: string;
    icon?: string;
    sunrise?: string;
    sunset?: string;
  };
  hourly_forecast?: HourlyForecastItem[];
  daily_forecast?: DailyForecastItem[];
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

export {
  REGIONAL_HIERARCHY,
  EXHAUSTIVE_CROPS,
  ALL_STATES,
  getDistrictsForState,
  getMandalsForDistrict,
  getVillagesForMandal,
  fetchOfficialVillages,
  type CropItem,
  type CropCategory,
  type VillageInfo,
} from "./regionalData";

import { EXHAUSTIVE_CROPS, ALL_STATES, getDistrictsForState } from "./regionalData";

export const states = ALL_STATES;

export const districts: Record<string, string[]> = {
  "Andhra Pradesh": getDistrictsForState("Andhra Pradesh"),
  Telangana: getDistrictsForState("Telangana"),
};

export const cropOptions = EXHAUSTIVE_CROPS;

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

export type RecoveryStep = {
  day?: string;
  day_range?: string;
  action: string;
  dosage?: string;
  purpose?: string;
};

export type DiseaseAnalysis = {
  crop: string;
  disease_name: string;
  scientific_name?: string;
  pathogen_type?: string;
  confidence_percent: number;
  severity: string;
  symptoms: string[];
  organic_treatment: string;
  chemical_treatment: string;
  nutrient_remedy?: string;
  micronutrient_remedy?: string;
  recovery_schedule_14d?: RecoveryStep[];
  recovery_schedule?: RecoveryStep[];
  prevention_tips?: string[];
  pmfby_coverage: string;
  advisory: string;
  engine?: string;
};

export type PestManagementItem = {
  pest_or_disease: string;
  symptoms: string;
  chemical_spray: string;
  organic_spray: string;
};

export type CropRecommendationItem = {
  crop_name: string;
  telugu_name: string;
  category: string;
  suitable_soils: string[];
  suitable_seasons: string[];
  min_water: string;
  duration_days: string;
  expected_yield_qtl_acre: string;
  avg_market_price_qtl: number;
  cultivation_cost_acre: number;
  estimated_net_profit_acre: number;
  fertilizer_protocol: Record<string, string>;
  pest_management: PestManagementItem[];
  intercrop_suitability: string;
  suitability_score: number;
  match_reasons: string[];
};

export type ColdStorageFacility = {
  id: string;
  name: string;
  district: string;
  state: string;
  location: string;
  facility_type: string;
  capacity_mt: number;
  available_space_mt: number;
  commodities: string[];
  temp_range: string;
  humidity_rh: string;
  monthly_rent_per_bag: number;
  bag_weight_kg: string;
  enwr_pledge_loan: boolean;
  loan_percent: string;
  contact_person: string;
  phone: string;
  features: string[];
};

export type StorageBookingRecord = {
  booking_token: string;
  facility_id: string;
  facility_name: string;
  district: string;
  state: string;
  location: string;
  farmer_name: string;
  phone: string;
  commodity: string;
  bags_count: number;
  duration_months: number;
  monthly_rent_inr: number;
  total_estimated_rent_inr: number;
  enwr_pledge_loan_eligible: boolean;
  booking_status: string;
  created_at: string;
  instructions: string;
};

export type FactoryContract = {
  id: string;
  factory_name: string;
  category: string;
  district: string;
  state: string;
  location: string;
  crop: string;
  direct_offer_price_qtl: number;
  mandi_benchmark_price_qtl: number;
  broker_commission_saved_percent: number;
  extra_profit_per_qtl: number;
  total_demand_qtl: number;
  procured_so_far_qtl: number;
  quality_specs: {
    moisture_max: string;
    staple_length: string;
    trash_content_max: string;
    min_lot_size_qtl: number;
  };
  payment_terms: string;
  procurement_officer: string;
  phone: string;
  verified_license: string;
};

export type DeliveryPassRecord = {
  pass_number: string;
  factory_id: string;
  factory_name: string;
  factory_location: string;
  factory_district: string;
  factory_state: string;
  procurement_officer: string;
  officer_phone: string;
  farmer_name: string;
  phone: string;
  origin_village: string;
  origin_district: string;
  crop: string;
  allocated_quantity_qtl: number;
  agreed_rate_per_qtl: number;
  total_estimated_payout_inr: number;
  broker_commission_saved_inr: number;
  delivery_date: string;
  status: string;
  generated_at: string;
  instructions: string;
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
