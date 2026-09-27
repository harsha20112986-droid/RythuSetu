const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return `${envUrl.trim().replace(/\/+$/, "")}/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

export const API_BASE = getApiBase();

export type Page = 
  | "home" 
  | "onboarding" 
  | "dashboard" 
  | "schemes" 
  | "benefits" 
  | "loss" 
  | "doctor" 
  | "admin" 
  | "mandi" 
  | "fertilizer" 
  | "recommendation" 
  | "storage" 
  | "factory" 
  | "nearby"
  | "machinery"
  | "harvest-shield"
  | "seed-verify"
  | "khata"
  | "action-center"
  | "pricing"
  | "organizations"
  | "privacy"
  | "terms";

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
  khata_survey_no?: string;
};

export type Farmer = {
  id: number;
  form: FormState;
};

export type Scheme = {
  id: string;
  name: string;
  scheme_name?: string;
  government_department?: string;
  category: string;
  scope: string;
  state?: string;
  icon: string;
  summary: string;
  benefit: string;
  eligibility_note: string;
  eligibility_rules?: string;
  crop_occupation_criteria?: string;
  application_channel?: string;
  required_documents?: string[];
  official_url: string;
  helpline?: string;
  last_verified: string;
  last_verified_date?: string;
  match_label: string;
  reasons: string[];
  eligibility_guidance_disclaimer?: string;
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
  reference_number?: string;
  crop: string;
  damage_type: string;
  loss_date: string;
  affected_area_acres: number;
  damage_percent: number;
  description: string;
  survey_number?: string;
  mandal?: string;
  village?: string;
  evidence_filename: string | null;
  status: string;
  farmer_self_status?: string;
  official_reference_number?: string;
  submission_date?: string;
  follow_up_date?: string;
  farmer_notes?: string;
  verifier_notes?: string;
  officer_notes?: string;
  submitted_at: string;
  next_step: string;
  is_within_window?: boolean;
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
  recommended_products?: AgriProductItem[];
  nearby_dealers?: AgriDealerItem[];
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
  verified_inputs?: AgriProductItem[];
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
  owner_notified?: boolean;
  manager_name?: string;
  manager_phone?: string;
  entry_allowed?: boolean;
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
  factory_owner_notified?: boolean;
  entry_allowed?: boolean;
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


export type UserRole = "farmer" | "data_verifier" | "support_agent" | "admin" | "super_admin";

export type ActionCenterItem = {
  action_id: string;
  action_key?: string;
  category: "CROP_INSURANCE" | "SCHEME" | "GRIEVANCE" | "DIRECT_MARKET" | "crop_loss" | "scheme" | "advisory" | "procurement" | string;
  action_type?: "GOVERNMENT_PORTAL" | "HELPLINE" | "DIRECT_PROCUREMENT" | "SERVICE_BOOKING" | "BENEFIT_APPLICATION" | string;
  title: string;
  description: string;
  official_organization: string;
  official_url: string;
  official_portal_url?: string;
  helpline: string | null;
  deadline: string | null;
  required_documents?: string[];
  preparation_checklist?: any[];
  rythusetu_generated_info?: Record<string, any>;
  verification_warning?: string;
  disclaimer?: string;
  user_action_label?: string;
  official_reference_number?: string | null;
  application_reference_number?: string | null;
  farmer_self_status?: string;
  self_tracked_status?: string;
  submission_date?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  last_verified_date?: string;
  source?: string;
  freshness_status?: string;
};

export type AuthUser = {
  username: string;
  name: string;
  role: UserRole;
  phone?: string;
  designation?: string;
  district?: string;
  state?: string;
  farmer_profile_id?: number | null;
  last_login_at?: string;
  is_online?: boolean;
};

export type AdminUserItem = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  phone: string;
  designation: string;
  district: string;
  state: string;
  farmer_profile_id?: number | null;
  created_at: string;
  last_login_at: string;
  is_online: boolean;
  status: string;
  farmer_profile?: {
    crop: string;
    land_area_acres: number;
    village: string;
    mandal: string;
    season: string;
  } | null;
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


export type CropVarietyItem = {
  variety: string;
  telugu_name: string;
  grade_tag: string;
  market_hub: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  key_trait: string;
  msp_benchmark: number;
  extra_over_msp: number;
  recommendation: string;
  action: string;
};

export type MandiMarketItem = {
  id?: number;
  mandi_name: string;
  market_hub?: string;
  district: string;
  state: string;
  crop: string;
  variety: string;
  telugu_name?: string;
  grade_tag?: string;
  key_trait?: string;
  action?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  msp_benchmark: number;
  extra_profit_vs_msp?: number;
  arrival_quintals: number;
  price_trend: "bullish" | "bearish" | "stable";
  trend_percent: number;
  recommendation: string;
  verified_date?: string;
  source?: string;
  source_url?: string;
  effective_date?: string;
  last_verified_at?: string;
  verification_status?: string;
  confidence?: number;
  data_trust_label?: string;
  data_trust_badge?: string;
  last_verified?: string;
};

export type MandiProvenance = {
  source_type: string;
  source_name: string;
  source_url?: string;
  effective_date: string;
  last_verified_at: string;
  verification_status: string;
  confidence: number;
  record_count?: number;
  trust_label?: string;
  disclaimer?: string;
  // Pipeline freshness fields (from get_mandi_prices_pipeline)
  freshness?: "LATEST" | "RECENT" | "DELAYED" | "STALE" | string;
  data_source_status?: "OFFICIAL_LATEST" | "OFFICIAL_LATEST_AVAILABLE" | "SOURCE_DELAYED" | "REFERENCE_ONLY" | "SOURCE_ERROR" | string;
  tier?: "DAILY_DB" | "VERIFIED_RECORDS" | "CURATED_REFERENCE" | string;
  age_days?: number;
  latest_record_date?: string;
};

export type MandiData = {
  crop: string;
  input_crop?: string;
  govt_msp_inr: number;
  highest_price?: number;
  highest_variety?: string;
  lowest_price?: number;
  lowest_variety?: string;
  average_modal_price: number;
  msp_difference_inr: number;
  msp_status: string;
  varieties?: CropVarietyItem[];
  markets: MandiMarketItem[];
  source: string;
  source_url?: string;
  timestamp?: string;
  last_verified?: string;
  last_verified_at?: string;
  verification_status?: string;
  confidence?: number;
  freshness?: "LATEST" | "RECENT" | "DELAYED" | "STALE" | string;
  data_source_status?: "OFFICIAL_LATEST" | "OFFICIAL_LATEST_AVAILABLE" | "SOURCE_DELAYED" | "REFERENCE_ONLY" | "SOURCE_ERROR" | string;
  market_date?: string;
  last_sync_timestamp?: string;
  msp_source?: string;
  msp_marketing_year?: string;
  provenance?: MandiProvenance;
};

export type MandiHistoryItem = {
  arrival_date: string;
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_quantity: number;
};

export type MandiComparisonItem = {
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_quantity: number;
  arrival_date: string;
};

export type MandiTrendData = {
  crop: string;
  district?: string | null;
  market?: string | null;
  latest_modal: number;
  previous_modal: number;
  absolute_change: number;
  percentage_change: number;
  trend: "UP" | "DOWN" | "STABLE";
  latest_arrival_date?: string;
  observations_count: number;
};

export type MspBenchmarkItem = {
  id: number;
  commodity: string;
  variety?: string;
  season: string;
  marketing_year: string;
  government_source: string;
  effective_date: string;
  price_per_quintal: number;
  source_url?: string;
  last_verified_at?: string;
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


// -------------------------------------------------------------
// Nearby Agro Infrastructure & Hyperlocal Market Hub Types
// -------------------------------------------------------------
export interface LocationSearchResult {
  state: string;
  district: string;
  mandal: string;
  village: string;
  native: string;
  pincode: string;
  code: string;
}

export interface NearbyMandiItem {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  distance_km: number;
  location: string;
  phone: string;
  major_commodities: string[];
  timing: string;
  enam_enabled: boolean;
  daily_arrivals_qtl: number;
  weighbridge_type: string;
  google_maps_url: string;
}

export interface NearbyMillItem {
  id: string;
  name: string;
  category: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  distance_km: number;
  location: string;
  crop: string;
  phone: string;
  direct_offer_price_qtl: number;
  mandi_benchmark_price_qtl: number;
  extra_profit_per_qtl: number;
  broker_commission_saved: string;
  payment_terms: string;
  quality_specs: string;
  google_maps_url: string;
}

export interface NearbyGodownItem {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  distance_km: number;
  location: string;
  phone: string;
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
  google_maps_url: string;
}

export interface NearbyHubData {
  farmer_location: {
    state: string;
    district: string;
    mandal?: string;
    crop?: string;
    gps: { lat: number; lon: number };
  };
  nearby_mandis: NearbyMandiItem[];
  nearby_mills: NearbyMillItem[];
  nearby_cold_storages: NearbyGodownItem[];
  summary: {
    total_mandis: number;
    total_mills: number;
    total_cold_storages: number;
    nearest_mandi: NearbyMandiItem | null;
    nearest_mill: NearbyMillItem | null;
    nearest_cold_storage: NearbyGodownItem | null;
  };
}

export interface StorePriceOption {
  store_name: string;
  price_inr: number;
  mrp_inr: number;
  savings_inr?: number;
  is_lowest: boolean;
  url: string;
  shipping: string;
  delivery_days: string;
  badge?: string;
}

export interface AgriProductItem {
  id: string;
  brand_name: string;
  telugu_brand_name?: string;
  manufacturer: string;
  category: string;
  chemical_formula: string;
  chemical_class?: string;
  target_crops: string[];
  target_pests: string[];
  recommended_dosage: string;
  application_method?: string;
  pack_size: string;
  image_url: string;
  cdn_image_url?: string;
  safety_notes?: string;
  price_comparison: StorePriceOption[];
}

export interface AgriDealerItem {
  id: string;
  store_name: string;
  telugu_name?: string;
  proprietor: string;
  phone: string;
  district: string;
  state: string;
  mandal: string;
  address: string;
  distance_km: number;
  license_no: string;
  gov_authorized: boolean;
  brands_stocked: string[];
  stock_status: string;
  operating_hours?: string;
  offers_doorstep_delivery?: boolean;
}

// -------------------------------------------------------------
// Farm Machinery Custom Hiring Hub Types
// -------------------------------------------------------------
export interface MachineryItem {
  id: string;
  machinery_type: string;
  telugu_name: string;
  brand_model: string;
  category: string;
  owner_name: string;
  owner_phone: string;
  district: string;
  state: string;
  mandal: string;
  village: string;
  distance_km: number;
  pricing_type: "per_hour" | "per_acre";
  rate_inr: number;
  rate_unit: string;
  suitable_operations: string[];
  availability_status: string;
  image_url: string;
  rating: number;
  total_trips: number;
}

export interface MachineryBookingRecord {
  booking_token: string;
  machinery_id: string;
  machinery_type: string;
  telugu_name: string;
  farmer_name: string;
  phone: string;
  district: string;
  village: string;
  acres_or_hours: number;
  pricing_type: string;
  rate_inr: number;
  estimated_cost_inr: number;
  required_date: string;
  status: string;
  operator_name: string;
  operator_phone: string;
  booked_at: string;
  instructions: string;
}

// -------------------------------------------------------------
// Kallam Drying Yard Harvest Weather Shield Types
// -------------------------------------------------------------
export interface TarpaulinCenterItem {
  id: string;
  supplier_name: string;
  telugu_name: string;
  contact_person: string;
  phone: string;
  district: string;
  state: string;
  location: string;
  distance_km: number;
  available_sizes: string[];
  rental_per_day_inr: number;
  purchase_price_inr: number;
  stock_status: string;
  operating_hours: string;
}

export interface HarvestShieldData {
  district: string;
  crop: string;
  risk_level: string;
  risk_score: number;
  drying_safety: string;
  recommended_drying_hours: string;
  critical_moisture_target: string;
  advisory_en: string;
  advisory_te: string;
  protection_steps: string[];
  tarpaulin_centers: TarpaulinCenterItem[];
}

// -------------------------------------------------------------
// Seed Authenticity Batch Verifier Types
// -------------------------------------------------------------
export interface SeedBatchData {
  lot_number: string;
  brand_name: string;
  telugu_name: string;
  crop: string;
  producer: string;
  producer_license: string;
  germination_tested_percent: number;
  min_germination_standard: number;
  physical_purity_percent: number;
  genetic_purity_percent: number;
  test_date: string;
  valid_until: string;
  treated_chemical: string;
  authenticity_status: string;
  state_registry: string;
  advisory: string;
}

export interface SeedVerificationResult {
  found: boolean;
  lot_number: string;
  batch_data?: SeedBatchData;
  is_genuine: boolean;
  authenticity_status?: string;
  warning_title?: string;
  warning_details?: string;
  action_required?: string;
}

export interface SeedGrievanceRecord {
  complaint_id: string;
  farmer_name: string;
  phone: string;
  village: string;
  district: string;
  dealer_name: string;
  seed_brand: string;
  lot_number: string;
  germination_failed_percent: number;
  notes: string;
  status: string;
  submitted_at: string;
  resolution_timeline: string;
}

// -------------------------------------------------------------
// Digital Agri Khata & Breakeven Calculator Types
// -------------------------------------------------------------
export interface KhataTemplate {
  crop_key: string;
  crop_name: string;
  default_acres: number;
  default_yield_quintals: number;
  expenses: Record<string, number>;
  msp_inr: number | null;
  standard_market_price_inr: number;
  storage_alternative: string;
  advisory_te: string;
}

export interface KhataCalculation {
  id: string;
  crop: string;
  acres: number;
  expenses: Record<string, number>;
  total_cost: number;
  cost_per_acre: number;
  expected_yield_per_acre: number;
  total_yield_quintals: number;
  breakeven_per_qtl: number;
  fair_target_price_per_qtl: number;
  offered_price_per_qtl: number;
  total_revenue: number;
  net_profit: number;
  profit_margin_pct: number;
  is_distress_loss: boolean;
  status_label: string;
  status_color: string;
  action_guidance: string;
  storage_alternative: string;
  created_at: string;
}

