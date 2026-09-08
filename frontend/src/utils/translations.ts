export type SupportedLanguage = "English" | "Telugu" | "Hindi";

export interface Translations {
  // Brand & Header
  appName: string;
  krishiAi: string;
  officerPortal: string;
  tagline: string;
  adminTagline: string;
  helpline: string;
  officerDesk: string;
  platformHome: string;
  home: string;
  dashboard: string;
  cropAdvisory: string;
  cropDoctor: string;
  mandiRates: string;
  acGodowns: string;
  directMills: string;
  nearbyHub: string;
  schemes: string;
  pmfby: string;
  registerFarmProfile: string;
  myFarm: string;
  signIn: string;
  signOut: string;
  register: string;
  adminBadge: string;
  farmerBadge: string;

  // Common UI Actions
  search: string;
  searchPlaceholder: string;
  filter: string;
  all: string;
  viewDetails: string;
  submit: string;
  cancel: string;
  refresh: string;
  loading: string;
  bookSpace: string;
  getPass: string;
  callSupport: string;
  backToHome: string;
  learnMore: string;
  status: string;
  active: string;
  verified: string;
  distance: string;
  acres: string;

  // Home Page
  homeHeroTitle: string;
  homeHeroHighlight: string;
  homeHeroSubtitle: string;
  startFarmProfile: string;
  exploreFeatures: string;
  quickServices: string;
  featuresSubtitle: string;

  // Feature Cards (Home / Dashboard)
  cardWeatherTitle: string;
  cardWeatherDesc: string;
  cardMandiTitle: string;
  cardMandiDesc: string;
  cardDoctorTitle: string;
  cardDoctorDesc: string;
  cardFertilizerTitle: string;
  cardFertilizerDesc: string;
  cardLossTitle: string;
  cardLossDesc: string;
  cardSchemesTitle: string;
  cardSchemesDesc: string;
  cardStorageTitle: string;
  cardStorageDesc: string;
  cardFactoryTitle: string;
  cardFactoryDesc: string;
  cardNearbyTitle: string;
  cardNearbyDesc: string;
  cardRecommendationTitle: string;
  cardRecommendationDesc: string;

  // Nearby Hub Page
  nearbyHeading: string;
  nearbySubtitle: string;
  nearbyAllTab: string;
  nearbyMandisTab: string;
  nearbyMillsTab: string;
  nearbyGodownsTab: string;
  nearByMandiBadge: string;
  nearByMillBadge: string;
  nearByGodownBadge: string;
  directPurchaseReady: string;
  coldStorageAvailable: string;
  mspGuaranteed: string;

  // Assistant & Chat
  assistantName: string;
  assistantPrompt: string;
  askAssistant: string;
  listening: string;
  speechSupport: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  English: {
    appName: "RythuSetu",
    krishiAi: "Krishi AI",
    officerPortal: "Officer Portal",
    tagline: "AI Bridge to Farmer Support",
    adminTagline: "Government Command Desk",
    helpline: "1800 Helpline",
    officerDesk: "🏛️ Officer Command Desk",
    platformHome: "Platform Home",
    home: "Home",
    dashboard: "Dashboard",
    cropAdvisory: "Crop Advisory",
    cropDoctor: "Crop Doctor",
    mandiRates: "Mandi Rates",
    acGodowns: "AC Godowns",
    directMills: "Direct Mills",
    nearbyHub: "Nearby Hub 📍",
    schemes: "Schemes",
    pmfby: "PMFBY Claims",
    registerFarmProfile: "Register Farm Profile",
    myFarm: "My Farm",
    signIn: "Sign In",
    signOut: "Sign Out",
    register: "Register",
    adminBadge: "Officer Portal",
    farmerBadge: "Cultivator",

    search: "Search",
    searchPlaceholder: "Search village, mandal, crop, market...",
    filter: "Filter",
    all: "All",
    viewDetails: "View Details",
    submit: "Submit",
    cancel: "Cancel",
    refresh: "Refresh",
    loading: "Loading...",
    bookSpace: "Book Cold Storage Slot",
    getPass: "Get Direct Delivery Pass",
    callSupport: "Call Helpline",
    backToHome: "Back to Home",
    learnMore: "Learn More",
    status: "Status",
    active: "Active",
    verified: "Government Verified",
    distance: "Distance",
    acres: "Acres",

    homeHeroTitle: "Smart Decisions for Every",
    homeHeroHighlight: "Smallholder Farmer",
    homeHeroSubtitle: "Real-time weather risk, live APMC Mandi rates, AI disease identification, certified AC storage & zero-broker factory connections across AP & Telangana.",
    startFarmProfile: "Register Your Farm Profile",
    exploreFeatures: "Explore Farm Services",
    quickServices: "Comprehensive Farm Intelligence",
    featuresSubtitle: "Everything a farmer needs from sowing to zero-broker harvest sales.",

    cardWeatherTitle: "Weather & Climate Risk",
    cardWeatherDesc: "Live district GPS climate intelligence, heat stress warnings, and rainfall forecasts.",
    cardMandiTitle: "Live Mandi & MSP Prices",
    cardMandiDesc: "Real-time APMC arrivals, modal rates, and MSP price security across 61 districts.",
    cardDoctorTitle: "AI Crop Doctor",
    cardDoctorDesc: "Diagnose plant diseases from leaf photos or symptom descriptions with certified dosages.",
    cardFertilizerTitle: "Scientific Fertilizer Plan",
    cardFertilizerDesc: "Tailored NPK split dosages per acre to maximize yield and eliminate soil degradation.",
    cardLossTitle: "PMFBY Crop Loss Claims",
    cardLossDesc: "Fast-track crop damage intimation with geotagged photo evidence and MAO tracking.",
    cardSchemesTitle: "Government Schemes",
    cardSchemesDesc: "Instant eligibility checks for PM-KISAN, Rythu Bharosa, and input subsidies.",
    cardStorageTitle: "Certified AC Godowns",
    cardStorageDesc: "Reserve cold storage slots for chillies, pulses, and turmeric to prevent distress sales.",
    cardFactoryTitle: "Direct Farm to Factory",
    cardFactoryDesc: "Sell directly to licensed processing mills and food corporations with zero middlemen.",
    cardNearbyTitle: "Nearby Agro Hub 📍",
    cardNearbyDesc: "Discover all nearby mandis, mills, and AC godowns ranked by precise road distance.",
    cardRecommendationTitle: "Crop Selection Advisor",
    cardRecommendationDesc: "Discover high-yield Kharif/Rabi crops matching your specific soil and irrigation.",

    nearbyHeading: "Hyperlocal Agricultural Infrastructure",
    nearbySubtitle: "Find government mandis, direct-purchase factories, and certified AC godowns closest to your village.",
    nearbyAllTab: "All Infrastructure",
    nearbyMandisTab: "APMC Mandis",
    nearbyMillsTab: "Direct Processing Mills",
    nearbyGodownsTab: "AC Cold Godowns",
    nearByMandiBadge: "Govt Mandi",
    nearByMillBadge: "Direct Purchase Factory",
    nearByGodownBadge: "Certified Cold Storage",
    directPurchaseReady: "Ready for Direct Purchase (0% Brokerage)",
    coldStorageAvailable: "Certified Preservation Facility",
    mspGuaranteed: "MSP Rate Guarantee",

    assistantName: "RythuSetu Krishi Assistant",
    assistantPrompt: "Ask anything about crops, pests, market rates, or government aid...",
    askAssistant: "Ask Krishi Assistant",
    listening: "Listening to your voice...",
    speechSupport: "Voice input in Telugu, Hindi & English",
  },

  Telugu: {
    appName: "రైతుసేతు",
    krishiAi: "కృషి AI",
    officerPortal: "అధికారుల పోర్టల్",
    tagline: "రైతు సంక్షేమానికి AI వారధి",
    adminTagline: "ప్రభుత్వ వ్యవసాయ కమాండ్ డెస్క్",
    helpline: "1800 ఉచిత హెల్ప్‌లైన్",
    officerDesk: "🏛️ వ్యవసాయ అధికారి డెస్క్",
    platformHome: "హోమ్ పేజీ",
    home: "హోమ్",
    dashboard: "డ్యాష్‌బోర్డ్",
    cropAdvisory: "పంట సలహా",
    cropDoctor: "పంట డాక్టర్",
    mandiRates: "మార్కెట్ ధరలు",
    acGodowns: "ఏసీ గోదాములు",
    directMills: "డైరెక్ట్ మిల్లులు",
    nearbyHub: "సమీప కేంద్రాలు 📍",
    schemes: "ప్రభుత్వ పథకాలు",
    pmfby: "పంట నష్టం క్లెయిమ్",
    registerFarmProfile: "రైతు వివరాలు నమోదు",
    myFarm: "నా వ్యవసాయం",
    signIn: "లాగిన్ అవ్వండి",
    signOut: "లాగ్ అవుట్",
    register: "ఖాతా తెరవండి",
    adminBadge: "అధికార పోర్టల్",
    farmerBadge: "రైతు",

    search: "వెతకండి",
    searchPlaceholder: "గ్రామం, మండలం, పంట లేదా మార్కెట్ పేరు టైప్ చేయండి...",
    filter: "ఫిల్టర్",
    all: "అన్నీ",
    viewDetails: "పూర్తి వివరాలు",
    submit: "సమర్పించండి",
    cancel: "రద్దు చేయండి",
    refresh: "తాజా సమాచారం",
    loading: "లోడ్ అవుతోంది...",
    bookSpace: "కోల్డ్ స్టోరేజ్ స్లాట్ బుక్ చేయండి",
    getPass: "ఫ్యాక్టరీ డెలివరీ పాస్ పొందండి",
    callSupport: "హెల్ప్‌లైన్‌కు కాల్ చేయండి",
    backToHome: "హోమ్‌కు తిరిగి వెళ్ళండి",
    learnMore: "మరిన్ని వివరాలు",
    status: "స్థితి",
    active: "క్రియాశీలకం",
    verified: "ప్రభుత్వ గుర్తింపు పొందినది",
    distance: "దూరం",
    acres: "ఎకరాలు",

    homeHeroTitle: "ప్రతి రైతుకు ఆధునిక సాంకేతిక",
    homeHeroHighlight: "నిర్ణయాల తోడ్పాటు",
    homeHeroSubtitle: "ఆంధ్రప్రదేశ్ & తెలంగాణలోని ప్రతి గ్రామానికి ప్రత్యక్ష వాతావరణ హెచ్చరికలు, లైవ్ మార్కెట్ ధరలు, AI తెగుళ్ల నివారణ మరియు దళారులు లేని నేరుగా మిల్లుల అనుసంధానం.",
    startFarmProfile: "రైతు ప్రొఫైల్ నమోదు చేయండి",
    exploreFeatures: "సేవల వివరాలు చూడండి",
    quickServices: "రైతుకు సమగ్ర సమాచార వేదిక",
    featuresSubtitle: "విత్తనం నాటినప్పటి నుండి పంటను గిట్టుబాటు ధరకు అమ్మే వరకు సంపూర్ణ సహాయం.",

    cardWeatherTitle: "వాతావరణం & వర్ష సూచన",
    cardWeatherDesc: "మీ జిల్లా రియల్-టైమ్ ఉష్ణోగ్రత, తేమ, తుఫాను హెచ్చరికలు మరియు వర్షపాత సమాచారం.",
    cardMandiTitle: "లైవ్ మార్కెట్ & మద్దతు ధరలు",
    cardMandiDesc: "61 జిల్లాల్లోని అన్ని వ్యవసాయ మార్కెట్ యార్డుల తాజా ధరలు మరియు కనీస మద్దతు ధర (MSP).",
    cardDoctorTitle: "AI పంట డాక్టర్",
    cardDoctorDesc: "ఆకు ఫోటో తీసి లేదా లక్షణాలు చెప్పి తెగుళ్లను గుర్తించండి; సరైన మందుల మోతాదు తెలుసుకోండి.",
    cardFertilizerTitle: "శాస్త్రీయ ఎరువుల మోతాదు",
    cardFertilizerDesc: "నేల రకాన్ని బట్టి ఎకరాకు అవసరమైన NPK ఎరువుల సమతుల్య మోతాదు సూచన.",
    cardLossTitle: "పంట నష్టం & బీమా క్లెయిమ్",
    cardLossDesc: "తుఫాను లేదా కరువు నష్టాన్ని వెంటనే నమోదు చేసి ప్రభుత్వ అధికారుల పరిశీలనకు పంపండి.",
    cardSchemesTitle: "ప్రభుత్వ పథకాలు & రాయితీలు",
    cardSchemesDesc: "పీఎం-కిసాన్, రైతు భరోసా మరియు విత్తన రాయితీల అర్హతలను తక్షణమే సరిచూసుకోండి.",
    cardStorageTitle: "సర్టిఫైడ్ ఏసీ గోదాములు",
    cardStorageDesc: "మిర్చి, పసుపు, పప్పు ధాన్యాలను నిల్వ చేసుకోవడానికి సమీప శీతల గిడ్డంగులను బుక్ చేయండి.",
    cardFactoryTitle: "రైతు నుండి నేరుగా ఫ్యాక్టరీలకు",
    cardFactoryDesc: "ఎటువంటి దళారులు, కమీషన్ లేకుండా నేరుగా ప్రాసెసింగ్ మిల్లులకు పంటను అమ్ముకోండి.",
    cardNearbyTitle: "సమీప వ్యవసాయ కేంద్రాలు 📍",
    cardNearbyDesc: "మీ గ్రామానికి అతి దగ్గర్లో ఉన్న మార్కెట్లు, మిల్లులు మరియు ఏసీ గోదాములను కనుగొనండి.",
    cardRecommendationTitle: "లాభదాయక పంటల ఎంపిక",
    cardRecommendationDesc: "మీ భూమి, నేల మరియు నీటి వసతికి సరిపోయే అత్యుత్తమ పంటల సిఫార్సు.",

    nearbyHeading: "గ్రామీణ వ్యవసాయ మౌలిక సదుపాయాలు",
    nearbySubtitle: "మీ గ్రామానికి సమీపంలో ఉన్న ప్రభుత్వ మార్కెట్ యార్డులు, కొనుగోలు మిల్లులు మరియు ఏసీ గోదాములు.",
    nearbyAllTab: "అన్ని కేంద్రాలు",
    nearbyMandisTab: "వ్యవసాయ మార్కెట్లు",
    nearbyMillsTab: "డైరెక్ట్ కొనుగోలు మిల్లులు",
    nearbyGodownsTab: "ఏసీ శీతల గిడ్డంగులు",
    nearByMandiBadge: "ప్రభుత్వ మార్కెట్",
    nearByMillBadge: "డైరెక్ట్ కొనుగోలు కేంద్రం",
    nearByGodownBadge: "ఏసీ కోల్డ్ స్టోరేజ్",
    directPurchaseReady: "దళారులు లేని కొనుగోలు (0% కమీషన్)",
    coldStorageAvailable: "ప్రభుత్వ సర్టిఫైడ్ నిల్వ కేంద్రం",
    mspGuaranteed: "కనీస మద్దతు ధర గ్యారెంటీ",

    assistantName: "రైతుసేతు కృషి అసిస్టెంట్",
    assistantPrompt: "పంటలు, తెగుళ్లు, మార్కెట్ ధరలు లేదా పథకాల గురించి అడగండి...",
    askAssistant: "కృషి అసిస్టెంట్‌ని అడగండి",
    listening: "మీ వాయిస్ వింటోంది...",
    speechSupport: "తెలుగు, హిందీ మరియు ఇంగ్లీషులో వాయిస్ సదుపాయం",
  },

  Hindi: {
    appName: "रैतुसेतु",
    krishiAi: "कृषि AI",
    officerPortal: "अधिकारी पोर्टल",
    tagline: "किसानों की सहायता के लिए एआई सेतु",
    adminTagline: "सरकारी कृषि कमान डेस्क",
    helpline: "1800 टोल फ्री हेल्पलाइन",
    officerDesk: "🏛️ कृषि अधिकारी कमान डेस्क",
    platformHome: "मुख्य पृष्ठ",
    home: "होम",
    dashboard: "डैशबोर्ड",
    cropAdvisory: "फसल सलाह",
    cropDoctor: "फसल डॉक्टर",
    mandiRates: "मंडी भाव",
    acGodowns: "एसी गोदाम",
    directMills: "सीधी मिलें",
    nearbyHub: "निकटतम केंद्र 📍",
    schemes: "सरकारी योजनाएं",
    pmfby: "फसल बीमा क्लेम",
    registerFarmProfile: "खेत प्रोफाइल दर्ज करें",
    myFarm: "मेरा खेत",
    signIn: "लॉग इन करें",
    signOut: "लॉग आउट",
    register: "पंजीकरण करें",
    adminBadge: "अधिकारी पोर्टल",
    farmerBadge: "किसान",

    search: "खोजें",
    searchPlaceholder: "गांव, मंडल, फसल या मंडी का नाम दर्ज करें...",
    filter: "फ़िल्टर",
    all: "सभी",
    viewDetails: "विवरण देखें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    refresh: "ताज़ा करें",
    loading: "लोड हो रहा है...",
    bookSpace: "कोल्ड स्टोरेज स्लॉट बुक करें",
    getPass: "फैक्ट्री डिलीवरी पास प्राप्त करें",
    callSupport: "हेल्पलाइन पर कॉल करें",
    backToHome: "होम पर लौटें",
    learnMore: "अधिक जानें",
    status: "स्थिति",
    active: "सक्रिय",
    verified: "सरकार द्वारा सत्यापित",
    distance: "दूरी",
    acres: "एकड़",

    homeHeroTitle: "हर छोटे और सीमांत किसान के लिए",
    homeHeroHighlight: "सटीक निर्णय सहायता",
    homeHeroSubtitle: "आंध्र प्रदेश एवं तेलंगाना के लिए वास्तविक समय मौसम जोखिम, लाइव एपीएमसी मंडी भाव, एआई रोग निदान और बिना बिचौलियों के मिलों से सीधी बिक्री।",
    startFarmProfile: "अपना खेत प्रोफाइल दर्ज करें",
    exploreFeatures: "कृषि सेवाएं देखें",
    quickServices: "व्यापक किसान सहायता मंच",
    featuresSubtitle: "बुवाई से लेकर लाभकारी फसल बिक्री तक संपूर्ण डिजिटल समाधान।",

    cardWeatherTitle: "मौसम एवं जलवायु जोखिम",
    cardWeatherDesc: "आपके जिले का सटीक जीपीएस मौसम, वर्षा चेतावनी और फसल सुरक्षा परामर्श।",
    cardMandiTitle: "लाइव मंडी भाव एवं एमएसपी",
    cardMandiDesc: "61 जिलों की कृषि मंडियों के दैनिक आगमन भाव और न्यूनतम समर्थन मूल्य (MSP)।",
    cardDoctorTitle: "एआई फसल डॉक्टर",
    cardDoctorDesc: "पत्ती की फोटो लेकर या लक्षण बताकर रोगों की पहचान करें और सही दवा की मात्रा जानें।",
    cardFertilizerTitle: "वैज्ञानिक उर्वरक योजना",
    cardFertilizerDesc: "मिट्टी के प्रकार के अनुसार संतुलित एनपीके (NPK) खाद की सही मात्रा।",
    cardLossTitle: "पीएम फसल बीमा क्लेम",
    cardLossDesc: "बाढ़, सूखा या कीट प्रकोप से फसल क्षति की तत्काल सूचना दर्ज करें।",
    cardSchemesTitle: "सरकारी योजनाएं एवं सब्सिडी",
    cardSchemesDesc: "पीएम-किसान, रैतु भरोसा और बीज सब्सिडी की पात्रता तुरंत जांचें।",
    cardStorageTitle: "प्रमाणित एसी कोल्ड स्टोरेज",
    cardStorageDesc: "मिर्च, दाल और हल्दी को सुरक्षित रखने के लिए नजदीकी कोल्ड स्टोरेज बुक करें।",
    cardFactoryTitle: "सीधे खेत से फैक्ट्री तक",
    cardFactoryDesc: "बिना किसी दलाल या कमीशन के सीधे प्रमाणित प्रोसेसिंग मिलों को अपनी उपज बेचें।",
    cardNearbyTitle: "निकटतम कृषि केंद्र 📍",
    cardNearbyDesc: "अपने गांव के सबसे करीब स्थित मंडियां, प्रसंस्करण मिलें और कोल्ड स्टोरेज खोजें।",
    cardRecommendationTitle: "लाभकारी फसल चयन",
    cardRecommendationDesc: "अपनी मिट्टी और पानी के अनुसार खरीफ/रबी मौसम की सबसे अनुकूल फसलें।",

    nearbyHeading: "स्थानीय कृषि अवसंरचना",
    nearbySubtitle: "आपके गांव के निकटतम सरकारी मंडियां, प्रत्यक्ष खरीद मिलें और प्रमाणित एसी गोदाम।",
    nearbyAllTab: "सभी केंद्र",
    nearbyMandisTab: "सरकारी मंडियां",
    nearbyMillsTab: "सीधी खरीद मिलें",
    nearbyGodownsTab: "एसी कोल्ड स्टोरेज",
    nearByMandiBadge: "सरकारी मंडी",
    nearByMillBadge: "सीधी खरीद फैक्ट्री",
    nearByGodownBadge: "प्रमाणित कोल्ड स्टोरेज",
    directPurchaseReady: "सीधी खरीद उपलब्ध (0% दलाली)",
    coldStorageAvailable: "प्रमाणित भंडारण सुविधा",
    mspGuaranteed: "एमएसपी गारंटी",

    assistantName: "रैतुसेतु कृषि सहायक",
    assistantPrompt: "फसल, कीट, मौसम, मंडी भाव या सरकारी सहायता के बारे में पूछें...",
    askAssistant: "कृषि सहायक से पूछें",
    listening: "आपकी आवाज सुन रहे हैं...",
    speechSupport: "तेलुगु, हिंदी और अंग्रेजी में आवाज सहायता",
  },
};

export function getTranslation(language: string = "English"): Translations {
  const langKey = (language in TRANSLATIONS ? language : "English") as SupportedLanguage;
  return TRANSLATIONS[langKey] || TRANSLATIONS.English;
}
