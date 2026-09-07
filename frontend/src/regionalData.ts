// Comprehensive Geographic Hierarchy & Exhaustive Crop Catalog for Andhra Pradesh & Telangana
// Structured for seamless multi-state expansion (e.g. Karnataka, Maharashtra, Tamil Nadu).

export type VillageData = string;

export type MandalData = {
  [mandalName: string]: VillageData[];
};

export type DistrictData = {
  [districtName: string]: MandalData;
};

export type StateHierarchy = {
  [stateName: string]: DistrictData;
};

export type CropCategory =
  | "All"
  | "Cereals & Millets"
  | "Pulses"
  | "Oilseeds"
  | "Commercial & Fiber"
  | "Spices & Condiments"
  | "Fruits & Plantation"
  | "Vegetables";

export type CropItem = {
  name: string;
  teluguName: string;
  category: Exclude<CropCategory, "All">;
  tag: string;
  key: string;
  majorSeasons: ("Kharif" | "Rabi" | "Summer")[];
};

export const REGIONAL_HIERARCHY: StateHierarchy = {
  "Andhra Pradesh": {
    "Guntur": {
      "Mangalagiri": ["Atmakuru", "Chinakakani", "Kaza", "Navuluru", "Nidamarru", "Nowluru", "Nutakki", "Yerrabalem"],
      "Tenali": ["Angalakuduru", "Burripalem", "Chinaravuru", "Kolanukonda", "Pinapadu", "Sangamjagarlamudi"],
      "Prathipadu": ["Edlapadu", "Gottipadu", "Kondrupadu", "Pedagottipadu", "Vangipuram"],
      "Ponnur": ["Brahmakoduru", "Dandimudi", "Jupudi", "Kasukarru", "Mamillapalle", "Nidumukkala"],
      "Chebrolu": ["Chebrolu", "Lemalle", "Pathareddypalem", "Selapadu", "Vadlamudi"],
      "Tadikonda": ["Bandarunalluru", "Damarapalli", "Kantheru", "Mothadaka", "Ponnekallu"],
      "Medikonduru": ["Dokiparru", "Gunturvaripalem", "Mandapadu", "Paladugu", "Perecherla"],
      "Pedakakani": ["Agathavarappadu", "Annamarlapudi", "Koppuravuru", "Pedakakani", "Takkellapadu"],
    },
    "Ananthapuramu (Anantapur)": {
      "Anantapur": ["Akuthotapalli", "Alamuru", "Chayanapuram", "Itikalapalli", "Kakkalapalli", "Rachana Palli"],
      "Dharmavaram": ["Chigicherla", "Gotluru", "Kethireddypalli", "Mallakalva", "Ravulacheruvu"],
      "Tadipatri": ["Alur", "Bhogasamudram", "Chukkalur", "Peddapolamada", "Sajjaladinne", "Vanganur"],
      "Gooty": ["Basinepalle", "Englibanda", "Jakkanahalli", "Karidikonda", "Kotakonda", "Thondapadu"],
      "Kalyandurg": ["Bhyravanithippa", "Chantapalli", "Garudachedu", "Golagapalli", "Manirevu"],
      "Rayadurg": ["Avuladatla", "D.Kondapuram", "Gummagatta", "Nagireddypalli", "Pulakurthi"],
      "Uravakonda": ["Budagavi", "Chendrayanapalli", "Iragampalli", "Pennahobilam", "Veligonda"],
      "Singanamala": ["Bandlapalli", "Garladinne", "Jallipalli", "Kalluru", "Salakamcheruvu"],
    },
    "Krishna (Machilipatnam)": {
      "Machilipatnam": ["Arisepalli", "Bandar", "Chinnapuram", "Gokavaram", "Kara Agraharam", "Pothepalli"],
      "Gudivada": ["Billapadu", "Chilakamarri", "Lingavaram", "Mallayapalem", "Mandavalli", "Valivarthipadu"],
      "Avanigadda": ["Chiruvallanka", "Edurumondi", "Nagayalanka", "Puligadda", "Vekanuru"],
      "Challapalli": ["Challapalli", "Lakshmipuram", "Majjigagudem", "Nadakuduru", "Puritigadda", "Yarlagadda"],
      "Pamarru": ["Balliparru", "Komaravolu", "Kurumaddali", "Pasumarru", "Rimmanapudi", "Uruturu"],
      "Pedana": ["Chennuru", "Jinjeru", "Kakulapadu", "Kamarajupeta", "Nelakurru", "Vadlamannadu"],
      "Bantumilli": ["Arthamuru", "Choragudi", "Guduru", "Koramilli", "Mallampudi", "Penduru"],
      "Movva": ["Avurupudi", "Bhatlapenumarru", "Chinamusidivada", "Kosuru", "Pedamuttevi"],
    },
    "NTR (Vijayawada)": {
      "Vijayawada Rural": ["Enikepadu", "Gollapudi", "Gudavalli", "Jakkampudi", "Nunna", "Pathapadu"],
      "Mylavaram": ["Chandragudem", "Ganapavaram", "Kuntamukkala", "Morangapalli", "Ponnavaram", "Pulluru"],
      "Tiruvuru": ["Akkapalem", "Chintalapadu", "Gampalagudem", "Kokilampadu", "Muddunuru", "Rolupadi"],
      "Jaggayyapeta": ["Annavaram", "Chillakallu", "Garikapadu", "Malkapuram", "Muktyala", "Shermohammadpeta"],
      "Nandigama": ["Ambarupeta", "Damuluru", "Kanchikacherla", "Magallu", "Pedavaram", "Torraguntapalem"],
      "Kanchikacherla": ["Battinapadu", "Gottumukkala", "Keesara", "Paritala", "Pendiyala", "Senagapadu"],
      "G.Konduru": ["Atukuru", "Chegireddypadu", "Kuntamukkala", "Nandigama", "Sunnampadu", "Velagaleru"],
      "Vissannapeta": ["Chandrupatla", "Kondaparva", "Kudapa", "Madhava Rao Peta", "Telladevarapalli"],
    },
    "Kurnool": {
      "Kurnool": ["Diguvapadu", "Edurur", "Gargeyapuram", "Munagalapadu", "Panchalingala", "Rudravaram"],
      "Adoni": ["Arekal", "Bompalli", "Chinnathumbalam", "Dhanapuram", "Havanur", "Peddathumbalam"],
      "Yemmiganur": ["Banavasi", "Devanakonda", "Gudikal", "Kadivella", "Mugathi", "Somasamudram"],
      "Kodumur": ["Amadaguntla", "Bodduvanipalli", "Gorantla", "Laddagiri", "Pyalakurthi", "Yerraguntla"],
      "Alur": ["Arikera", "Chippagiri", "Halaharvi", "Molagavalli", "Peddahothur", "Sulekeri"],
      "Pattikonda": ["Devalapuram", "Hosur", "Kotakonda", "Pandikona", "Peddahulthi", "Puttapasam"],
      "Gonegandla": ["Alavala", "Bijjagulla", "Gonegandla", "Hampapuram", "Peddanelaturu"],
      "Mantralayam": ["Chettinehalli", "Kachapuram", "Madhavaram", "Rachumarri", "Sujathapuram", "Tungabhadra"],
    },
    "Nandyal": {
      "Nandyal": ["Ayyalur", "Bandiatmakur", "Bheemavaram", "Chabolu", "Mitnala", "Panyam", "Polur"],
      "Allagadda": ["Ahobilam", "Basureddypalli", "Chintakunta", "Gubagundam", "Muthaluru", "Yallur"],
      "Banaganapalle": ["Appalapuram", "Enakandla", "Illuru Kalan", "Mitmalla", "Palukuru", "Timmayanapalli"],
      "Dhone": ["Bugganapalli", "Chanugondla", "Gooty Peta", "Kothakota", "Pendekallu", "Ungaranigundla"],
      "Nandikotkur": ["Alaganuru", "Bollavaram", "Brahmanakotkur", "Konidela", "Malyala", "Tarturu"],
      "Atmakur": ["Bairluty", "Indireswaram", "Karivena", "Nagaloor", "Pothireddypadu", "Siddepalle"],
      "Koilkuntla": ["Alvakonda", "Bompalli", "Chintalayapalli", "Gulladurthi", "Kampamalla", "Revanuru"],
      "Srisailam": ["Chinna Arutla", "Hatam", "Mallela", "Pedda Arutla", "Sunnipenta"],
    },
    "West Godavari (Bhimavaram)": {
      "Bhimavaram": ["Annavaram", "Bethapudi", "Dharmavaram", "Komarada", "Losarigutlapadu", "Rayalam"],
      "Palakollu": ["Agarthipalem", "Goraganamudi", "Lanka", "Palakollu Rural", "Sivadevuni Chikkala", "Yelamanchili"],
      "Narasapuram": ["Chitlana", "Gondhi", "Koppunuru", "L.B.Charla", "Navarasapuram", "Sitaramapuram"],
      "Tanuku": ["Duvva", "Mandapaka", "Pydiparru", "Sajjapuram", "Tetali", "Vandram", "Velpuru"],
      "Tadepalligudem": ["Apparaopeta", "Kadiyada", "Madhavaram", "Nawabpalem", "Padala", "Venkataramannagudem"],
      "Achanta": ["Achanta Vemavaram", "Khandavalli", "Kodamanchili", "Pedamallam", "Penugonda", "Valluru"],
      "Undi": ["Arthamuru", "Chilukuru", "Mahadevapatnam", "Panduvva", "Undi Rural", "Uppuluru"],
      "Akividu": ["Akividu Rural", "Appalarajugudem", "Chinagollapalem", "Dharmapuram", "Kollaparru"],
    },
    "East Godavari (Rajahmundry)": {
      "Rajahmundry Rural": ["Bommuru", "Dowleswaram", "Hukumpeta", "Katheru", "Morampudi", "Torredu"],
      "Kadiam": ["Damireddypalle", "Jegurupadu", "Kadiyapulanka", "Madhavarayudupalem", "Muramanda", "Veeravaram"],
      "Rajanagaram": ["Chakradwarabandham", "G.Ragampeta", "Kanavaram", "Namavaram", "Pathatungapadu", "Tokada"],
      "Anaparthi": ["Anaparthi Rural", "Dupperlapudi", "Koppavaram", "Polamuru", "Ramavaram"],
      "Biccavolu": ["Arikirevula", "Biccavolu Rural", "Komaripalem", "Rangampeta", "Tossipudi"],
      "Korukonda": ["Burasakota", "Dosakayalapalle", "Gadarada", "Jambupatnam", "Kotikesavaram", "Narasapuram"],
      "Gokavaram": ["Adivikameswaram", "Gokavaram Rural", "Kamalapuram", "Kotananduru", "Takurpalem"],
      "Devarapalle": ["Bandapuram", "Devarapalle", "Duddukuru", "Kurukuru", "Palleramudi", "Tyajampudi"],
    },
    "Chittoor": {
      "Chittoor": ["Anupalle", "Greamspeta", "Kattamanchi", "Mangasamudram", "Murukambattu", "Thimmasamudram"],
      "Palamaner": ["Alapalle", "Baireddipalle", "Kurubalapalle", "Melumoi", "Moram", "Samireddipalle"],
      "Kuppam": ["Gudupalle", "Kangundhi", "Mallanuru", "Peddabangaranatham", "Santhipuram", "Vasanadu"],
      "Bangarupalem": ["Bodabandla", "Gundlapalle", "Mogilipennagar", "Ragimanupenta", "Tekumanda"],
      "Punganur": ["Chowdepalle", "Etavakili", "Magandlapalle", "Melipatla", "Somala", "Vanamaladinne"],
      "Nagari": ["Bugga Agraharam", "Ekambarakuppam", "Keelapudi", "Mitta Kandriga", "Therani"],
      "Puttur": ["Cherlopalle", "Kumarabommrajupuram", "Nandiambakam", "Sirugurajupalem", "Vepagunta"],
      "Karvetinagar": ["Annur", "Gajankuppam", "Katuru", "Mukkara Kandriga", "Surendranagaram"],
    },
    "Tirupati": {
      "Tirupati Rural": ["Avilala", "Chandragiri", "Daminedu", "Perur", "Thummalagunta", "Vedantapuram"],
      "Srikalahasti": ["Bahubalendrunipeta", "Cherlapalli", "Gollapalli", "Kailasapuram", "Subrahmanyapuram", "Urandur"],
      "Gudur": ["Chillakur", "Kota", "Manubolu", "Nellatur", "Tippavarappadu", "Vindur"],
      "Sullurpeta": ["Doravarisatram", "Kudiri", "Mannarpolur", "Shar", "Vatambedu"],
      "Venkatagiri": ["Balayapalli", "Chavatapalem", "Dakkili", "Kalavalla", "Kummarapeta", "Manchuluru"],
      "Chandragiri": ["Agarampalle", "Arepalle", "Itepalle", "Kotabayalu", "Narasingapuram", "Reddivaripalle"],
      "Pakala": ["Damalacheruvu", "Gorpadu", "Motumallela", "Padipeta", "Vallivedu"],
      "Nagari (East)": ["Govindavaram", "Kalluru", "Mangalam", "Settigunta"],
    },
    "Visakhapatnam": {
      "Bheemunipatnam": ["Chepalauppada", "Dakamarri", "Kapuluppada", "Majjavaram", "Nidigattu", "Tagarapuvalasa"],
      "Anandapuram": ["Gambheeram", "Gidijala", "Kusuluvada", "Palavalasa", "Sontyam", "Vellanki"],
      "Padmanabham": ["Ananthavaram", "Bhandevupuram", "Kovvada", "Maddilapalem", "Padmanabham Rural", "Reddipalli"],
      "Pendurthi": ["Chintagatla", "Gorapalli", "Mudapaka", "Pendurthi Rural", "Porlupalem", "Valimeraka"],
      "Gajuwaka": ["Aganampudi", "Desapatrunipalem", "Duvvada", "Kurmannapalem", "Mindi", "Pedagantyada"],
      "Seethammadhara": ["Adavivaram", "Arilova", "Kailasagiri", "Madhurawada", "Rushikonda", "Yendada"],
    },
    "Anakapalli": {
      "Anakapalle": ["Bowluvada", "Gollalapalem", "Kasimkota", "Marturu", "Papayya Santhapalem", "Thummapala"],
      "Chodavaram": ["Ambherupeta", "Govada", "Lakshmipuram", "Mudapaka", "Penumarthi", "Rayapurajupeta"],
      "Madugula": ["Appalarajupuram", "Gopalapatnam", "Jalampalle", "Kinthali", "Madugula Rural", "Vaddadi"],
      "Narsipatnam": ["Balighattam", "Cheedigummala", "Dharapalem", "Pedaboddepalle", "Sitaramapuram", "Vempadu"],
      "Yelamanchili": ["Dimili", "Kokkirapalli", "Krishnapuram", "Pulaparthi", "Regupalem", "Somalingapalem"],
      "Payakaraopeta": ["Editha", "Gopalapatnam", "Kotturu", "Mangavaram", "Nandivada", "Pentakota"],
      "Kovvada": ["Cheepurupalli", "Devada", "Kotturu", "Paravada", "Vennelapalem"],
    },
    "Kakinada": {
      "Kakinada Rural": ["Atchempeta", "Ganganapalle", "Kovvuru", "Nemam", "Panduru", "Sarpavaram", "Thimmapuram"],
      "Samalkota": ["Bhimavaram", "G.Medapadu", "Jaggampeta", "Madhavapatnam", "Navara", "Peddabrahmadevam"],
      "Pithapuram": ["Chebrolu", "Fakkirbada", "Gollaprolu", "Kothapalle", "Mallam", "Navakhandravada"],
      "Peddapuram": ["Annavaram", "Chandramampeta", "Divili", "Kandrakota", "Marriveedu", "Tirupati"],
      "Thondangi": ["A.V.Nagaram", "Annavaram", "Kona Forest", "Perumallapuram", "Srungavruksham"],
      "Gollaprolu": ["Chebrolu", "Durgada", "Kodavali", "Tatiparthi", "Vannepudi"],
      "Tuni": ["D.Polavaram", "Hamsavaram", "Kolimeru", "Nandivada", "Rekhavanipalem", "Tetagunta"],
    },
    "Dr. B.R. Ambedkar Konaseema": {
      "Amalapuram": ["Bhatnavilli", "Chindada", "Edarapalle", "Indupalle", "Peruru", "Samannasa"],
      "Razole": ["Chinchinada", "Gudimellanka", "Kadali", "Malkipuram", "Podalada", "Sakhinetipalle"],
      "Kothapeta": ["Avidi", "Billakurru", "Devarapalle", "Ganti", "Palivela", "Vanapalle"],
      "Ramachandrapuram": ["Artamuru", "Draksharama", "Hasanbada", "Narasapurapupeta", "Vella"],
      "Mandapeta": ["Appanaramachandrapuram", "Iragavaram", "Medapadu", "Tapeswaram", "Velagathodu"],
      "Mummidivaram": ["Anathavaram", "Cheyyeru", "Komaragiri", "Krapa", "Muramalla"],
      "Allavaram": ["Allavaram Rural", "Bendamurlanka", "Godilanka", "Komaragiripatnam", "Samanthakurru"],
    },
    "Eluru": {
      "Eluru": ["Chataparru", "Denduluru", "Kovvali", "Malkapuram", "Ponangi", "Sanivarapupeta", "Satrampadu"],
      "Chintalapudi": ["Allipalli", "Chagallu", "Gonavaram", "Lingagudem", "Raghavapuram", "Talarlapalli"],
      "Kaikalur": ["Alapadu", "Atapaka", "Bhujabalapatnam", "Gopavaram", "Kottada", "Varahapatnam"],
      "Jangareddigudem": ["Akkanagudem", "Ammapalem", "Challagari", "Devulapalle", "Nimmalagudem", "Pattannagudem"],
      "Polavaram": ["Chegondapalli", "Gaddapalle", "Mamidigondi", "Pattiseema", "Singannapalle"],
      "Nuzvid": ["Batthulavarigudem", "Devaragunta", "Hanumanthunigudem", "Morangapalli", "Tukkuluru"],
    },
    "Palnadu (Narasaraopet)": {
      "Narasaraopet": ["Chagallu", "Ellamanda", "Jonnalagadda", "Kakani", "Petlurivaripalem", "Ravipadu"],
      "Sattenapalle": ["Abburu", "Bhatluru", "Dhulipalla", "Gudipudi", "Kankanalapalle", "Pakalapadu"],
      "Vinukonda": ["Brahmanapalle", "Chavitipalem", "Gokanakonda", "Nagalavaram", "Sivapuram", "Vittalam"],
      "Gurazala": ["Ambapuram", "Dachepalle", "Jangamaheswarapuram", "Madugula", "Telukutla"],
      "Macherla": ["Adigoppula", "Kambampadu", "Mutukur", "Pasarlapadu", "Rentachintala", "Vijayapuri"],
      "Chilakaluripet": ["Edavalli", "Ganapavaram", "Kavuru", "Manukondavaripalem", "Pasumarru", "Purushothapatnam"],
    },
    "Bapatla": {
      "Bapatla": ["Appikatla", "Etheru", "Jillellamudi", "Maruproluvaripalem", "Murukondapadu", "Poondla"],
      "Chirala": ["Epurupalem", "Gavandlapalem", "Ithanagar", "Karamchedu", "Perali", "Vetapalem"],
      "Repalle": ["Betapudi", "Chodavaram", "Isukapalli", "Lankevanidibba", "Penumudi", "Peteru"],
      "Vemuru": ["Aluru", "Chavali", "Jampani", "Kuputhur", "Penumaka", "Varahapuram"],
      "Addanki": ["Chinna Kothapalli", "Dharmavaram", "Gopalapuram", "Manikeswaram", "Nagulapadu"],
      "Parchur": ["Bodduvanipalem", "Cherukur", "Inagallu", "Kondubhotlapalem", "Upputur"],
    },
    "Prakasam (Ongole)": {
      "Ongole": ["Annavarappadu", "Chennupadu", "Karavadi", "Koppolu", "Maddipadu", "Pelluru", "Ulchi"],
      "Kandukur": ["Ananthasagaram", "Chalamcherla", "Jillelamudi", "Kovuru", "Mopadu", "Oguru"],
      "Markapur": ["Bommireddypalli", "Chinnamambanoor", "Darimadugu", "Gajjalakonda", "Rayavaram"],
      "Giddalur": ["Akaveedu", "Ambavaram", "Chattupadu", "Komarolu", "Mundlapadu", "Racherla"],
      "Podili": ["Annangi", "Chavatapalem", "Kambaladinne", "Madalavaripalem", "Nandavaram"],
      "Kanigiri": ["Challagirigala", "Guravajipeta", "Kalluru", "Punugodu", "Takkellapadu"],
    },
    "Sri Potti Sriramulu Nellore": {
      "Nellore": ["Allipuram", "Buja Buja Nellore", "Chintareddypalem", "Kallurpalle", "Pottepalem"],
      "Kovur": ["Gangavaram", "Inamadugu", "Kovur Rural", "Padugupadu", "Paturu", "Veguru"],
      "Atmakur": ["Alimili", "Apparaopalem", "Bramhadewam", "Kothapalle", "Mahimaluru", "Vasili"],
      "Kavali": ["Budamgunta", "Chalama Cherla", "Gouravaram", "Musunuru", "Ramiroddypalem"],
      "Venkatachalam": ["Idimepalli", "Kakaturu", "Kasumuru", "Kondanapudi", "Survepalli"],
      "Indukurpet": ["Gangapatnam", "Kudithipalem", "Mypadu", "Nidigatla", "Pallipadu"],
    },
    "YSR Kadapa": {
      "Kadapa": ["Akkayapalle", "C.K.Dinne", "Chemmumiapet", "Chinrachapalle", "Mammillapalle", "Utukur"],
      "Proddatur": ["Bollavaram", "Dorasanipalle", "Kalluru", "Modameedapalle", "Rameswaram"],
      "Pulivendula": ["Alavalapadu", "Bakharapuarm", "Brahmana Palli", "Karakavandlapalle", "Velpula"],
      "Jammalamadugu": ["Dommaranandyala", "Gandi Kota", "Moragudi", "Peddadandluru", "Yerraguntla"],
      "Mydukur": ["Badvel", "Chapad", "Khadarabad", "Settivaripalle", "Somireddypalle"],
      "Kamalapuram": ["Chinnacheppali", "Gangavaram", "Pachuru", "Pandillapalle", "Yerragudipadu"],
    },
    "Annamayya (Rayachoty)": {
      "Rayachoti": ["Appannagaripalle", "Chinnamandem", "Galiveedu", "Madhavaram", "Sibyala"],
      "Madanapalle": ["Basinikonda", "Chippili", "Kollabylu", "Ponnetipalem", "Valasapalle"],
      "Rajampet": ["Brahmanapalle", "Hastavaram", "Mannuru", "Tallapaka", "Utukuru"],
      "Railway Kodur": ["Anantharajupeta", "Chitvel", "Kothapalle", "Madhavaram", "Settigunta"],
      "Pileru": ["Agaram", "Bodireddigaripalle", "Gudrevupalle", "Mellacheruvu", "Yerraguntla"],
      "Tamballapalle": ["Eguvapalle", "Kosupalle", "Peddapalem", "Reddivaripalle"],
    },
    "Sri Sathya Sai (Puttaparthi)": {
      "Puttaparthi": ["Beedupalli", "Brahmanapalli", "Enumulapalli", "Kappalabanda", "Peddapalli"],
      "Kadiri": ["Alampur", "Cherlopalli", "Kaikuntla", "Muthyalacheruvu", "Pandiparthi"],
      "Hindupur": ["Chilamathur", "Gorantla", "Kotnur", "Lepakshi", "Maluguru", "Santhebidanur"],
      "Madakasira": ["Bullasudram", "Gauridanur", "Hemavathi", "Kallumarri", "Manuru"],
      "Penukonda": ["Gutturu", "Konapuram", "Munimadugu", "Nagulaguduru", "Settipalle"],
      "Bukkapatnam": ["Agraharam", "Devaragudipalli", "Kothakota", "Pamudurthi", "Siddarampuram"],
    },
    "Srikakulam": {
      "Srikakulam": ["Arasavilli", "Chinnabarampuram", "Gujarathipeta", "Kallepalli", "Peddapadmapuram"],
      "Amadalavalasa": ["Akulatampara", "Chinna Jonnavalasa", "Kottavalasa", "Thogaram", "Zillavanipeta"],
      "Tekkali": ["Brundavanapuram", "Chintada", "Nandigam", "Raghunathapuram", "Temburu"],
      "Palasa": ["Ananthagiri", "Brahmana Tarla", "Chinabadam", "Kashibugga", "Rentikota"],
      "Narasannapeta": ["Alikam", "Challavanipeta", "Jammu", "Madapam", "Tilaru"],
      "Ichchapuram": ["Bellupada", "Edupalli", "Kaviti", "Masahebpeta", "Surangi"],
    },
    "Vizianagaram": {
      "Vizianagaram": ["Dharmapuri", "Gunkalam", "Jammunarayanapuram", "Malicherla", "Phoolpaugh"],
      "Gajapathinagaram": ["Budathanapalli", "Chinnamariki", "Logisa", "Marupalli", "Puritipenta"],
      "Bobbili": ["Alajangi", "Barli", "Gullapalli", "Mettavalasa", "Pakki", "Piridi"],
      "Cheepurupalli": ["Alajangi", "Karlam", "Metlapalli", "Peda Nadipalli", "Viswanadhapuram"],
      "Srungavarapukota": ["Bhimasingi", "Dharmavaram", "Kotabommali", "Pothanapalli", "Vepada"],
      "Kothavalasa": ["Chinna Rao Peta", "Dandigam", "Kandivalasa", "Musiram", "Santhapalem"],
    },
    "Parvathipuram Manyam": {
      "Parvathipuram": ["Adaru", "Chilakalapalli", "Dokiseela", "Gopalapuram", "Mruthyunjayanagaram"],
      "Salur": ["Bagulamitta", "Duggeru", "Mamillapalli", "Pachipenta", "Tonam"],
      "Kurupam": ["Bhimpuram", "Gujjipadu", "Mondemkhallu", "Neelakantapuram", "Rikabapadu"],
      "Palakonda": ["Annavaram", "Chinna Mangalam", "Gulumuru", "Navabpeta", "Singannavalasa"],
      "Gummalakshmipuram": ["Bhadragiri", "Dummaguda", "Kedapuram", "Lakkaguda", "Tadivalasa"],
      "Seethampeta": ["Donubai", "Kusimi", "Manda", "Polla", "Valagadda"],
    },
    "Alluri Sitharama Raju (Paderu)": {
      "Paderu": ["Dokuluru", "Gangaraju Madugula", "Hukumpeta", "Minumuluru", "Vanthala"],
      "Araku Valley": ["Bosubeda", "Chompi", "Madagada", "Padmapuram", "Sunkarametta"],
      "Chintapalle": ["Balapam", "Kothuru", "Lammasingi", "Tajangi", "Yerrabanda"],
      "Rampachodavaram": ["Bandapalli", "Chodavaram", "Devipatnam", "Gedhada", "Musurumilli"],
      "Maredumilli": ["Boduluru", "Chavulamaddi", "Kondamodalu", "Valamuru", "Vanthada"],
      "Ananthagiri": ["Borra", "Gummakota", "Kasinagaram", "Pinakota", "Tokuru"],
    },
  },

  "Telangana": {
    "Warangal": {
      "Narsampet": ["Chennaraopet", "Dasanapally", "Itikalapally", "Lingagiri", "Madannapet", "Maqdumpuram", "Muthojipet", "Rajupet", "Ramavaram", "Sarwapur"],
      "Chennaraopet": ["Ameenabad", "Jallipalle", "Konapuram", "Lingagiri", "Papaiahpalle", "Thimmarampalle", "Yellapur"],
      "Duggondi": ["Adaviranpur", "Girnibavi", "Mandapalle", "Nachinapalle", "Ponikal", "Thimmampet", "Venkatapur"],
      "Geesugonda": ["Dharmaram", "Gangadevipalli", "Geesugonda", "Gorrekunta", "Mogilicherla", "Shayampet", "Vanchangiri"],
      "Wardhannapet": ["Bandautlapally", "Dharmaram", "Illanda", "Kakkiralapalle", "Kondarthy", "Panthini", "Yellanda"],
      "Parvathagiri": ["Choutapalle", "Enugal", "Gopulagiri", "Kalleda", "Ravuru", "Somaram", "Vadlakonda"],
      "Rayaparthy": ["Gannaram", "Jagannadhapalle", "Kolakonda", "Moripirala", "Perikedu", "Sannur"],
      "Khanapur": ["Budharaopet", "Dharmaraopet", "Kothuru", "Mangalvaripet", "Rampur", "Veeraiahpalle"],
      "Sangem": ["Alimpur", "Bollepalle", "Elkurthy", "Gavaravaram", "Kapunoor", "Pallagutta", "Theegarajupally"],
      "Nekkonda": ["Appalaraopet", "Chandrugonda", "Gotlakonda", "Mallela", "Nekkonda Rural", "Pedakorpolu", "Topanapalle"],
    },
    "Hanamkonda": {
      "Hanamkonda": ["Amruthapur", "Bhimaram", "Gorrekunta", "Kumarpalli", "Madikonda", "Palvelpula", "Rampur"],
      "Kazipet": ["Ammapuram", "Bapuji Nagar", "Kadipikonda", "Madikonda", "Somidi", "Tharalapally"],
      "Inavolu": ["Inavolu", "Kakkiralapalli", "Kondaparthy", "Panthini", "Punukugondla", "Venkatapur"],
      "Kamalapur": ["Ambala", "Ganneruvaram", "Kannur", "Madannapet", "Shanigarampalle", "Uppal"],
      "Parkal": ["Kamareddypalle", "Nagaram", "Parkal Rural", "Pocharam", "Rajupalle", "Vellampalle"],
      "Shayampet": ["Husainpalle", "Kothagattu", "Mylaram", "Neredpalle", "Suraram", "Vasanthapur"],
      "Atmakur": ["Agrumpalle", "Brahmunpalle", "Chowdlapalle", "Katrapalle", "Neerukulla", "Penchikalpet"],
      "Bheemadevarpalle": ["Kaikonda", "Koppur", "Mallaram", "Mustafapur", "Ratnapur", "Vangara"],
    },
    "Karimnagar": {
      "Karimnagar": ["Alugunoor", "Bommakal", "Chinthakunta", "Durshed", "Manoor", "Rekurthi", "Theegalaguttapalle"],
      "Huzurabad": ["Bornapalle", "Chelpur", "Jupaka", "Kaniparthi", "Peddapapiahpalle", "Sirapalle"],
      "Jammikunta": ["Bijigiri Sharif", "Illanthakunta", "Nagampet", "Sayampet", "Tanugula", "Vavilala"],
      "Choppadandi": ["Arnakonda", "Bhoopalapatnam", "Chinnakandukuru", "Gudur", "Gumlapur", "Rukmapur"],
      "Manakondur": ["Gatla Narsingapur", "Kondapalkala", "Laxmipur", "Mutharam", "Pothireddypalle", "Vemulanarva"],
      "Gangadhara": ["Achampalle", "Gundlapalle", "Kurikyala", "Malyal", "Narasimhulapalle", "Sarvareddipalle"],
      "Thimmapur": ["Alugunoor", "Mannempalli", "Marrigadda", "Neredupalle", "Nusthulapur", "Pothgal"],
      "Veenavanka": ["Brahmanapalle", "Challur", "Elbak", "Ganneruvaram", "Kallur", "Kondapaka"],
    },
    "Nizamabad": {
      "Nizamabad North": ["Badsi", "Dharmaram", "Gundaram", "Kanteshwar", "Madhavnagar", "Mubaraknagar"],
      "Armoor": ["Alur", "Ankapur", "Bardipur", "Chikhli", "Deogaon", "Issapalle", "Mamillapalle", "Perkit"],
      "Bodhan": ["Bhanpur", "Chikkanpalle", "Erakpalle", "Kaloor", "Mavandi Kalan", "Salura", "Yedapalle"],
      "Balkonda": ["Balkonda Rural", "Bodepalle", "Chittapur", "Itikyal", "Kothapalle", "Mendora", "Savel"],
      "Dichpally": ["Bardipur", "Dharpally", "Ghanpur", "Koratpalle", "Mullangi", "Nadigadda", "Yannambail"],
      "Jakranpally": ["Arsapalle", "Brahmanpalle", "Kaligot", "Kolhapur", "Madepalle", "Torlikonda"],
      "Kotgiri": ["Baswapur", "Domburgi", "Ethonda", "Kallur", "Kotgiri Rural", "Pothangal"],
      "Varni": ["Chintakunta", "Jalalpur", "Mallaram", "Rampur", "Siddapur", "Varni Rural"],
    },
    "Khammam": {
      "Khammam Urban": ["Ballepalli", "Danavaigudem", "Khanapuram", "Mallemadugu", "Pandillapalli", "Tekulapalli"],
      "Khammam Rural": ["Arempula", "Edulapuram", "Khammam Mettu", "Maddulapalli", "Polepalli", "Theldarupalli"],
      "Madhira": ["Allinagaram", "Chinnakoduru", "Dendukuru", "Mallavaram", "Nidigonda", "Torraguntapalem"],
      "Wyra": ["Asthanagurthi", "Dachepalli", "Gollapudi", "Karamgudem", "Konijerla", "Somavaram"],
      "Sathupalli": ["Gangaram", "Kalluru", "Kistaram", "Rejarla", "Rudrakshapalli", "Vemsoor"],
      "Kusumanchi": ["Bhagyanagarathanda", "Geesugonda", "Kokireni", "Malyala", "Nelapatla", "Palair"],
      "Tirumalayapalem": ["Bachodu", "Errapadu", "Hussainpuram", "Jellacheruvu", "Medidapalle", "Solipuram"],
      "Nelakondapalli": ["Aregudem", "Bodulabanda", "Byranpalli", "Chirumarri", "Mandrajupalli", "Rajarampet"],
    },
    "Nalgonda": {
      "Nalgonda": ["Arjalabavi", "Cherlapally", "Chityal", "Dandepally", "Kanagal", "Marriguda", "Mushampally"],
      "Miryalaguda": ["Alagadapa", "Chinthapally", "Gudur", "Keshawapur", "Rayapatnam", "Venkatadripet", "Yadgarpally"],
      "Devarakonda": ["Chintapalle", "Gundlapalle", "Kondamallepally", "Mudigonda", "Padamati Palle", "Seripally"],
      "Nakrekal": ["Chinnakandukur", "Mangalpally", "Nellibanda", "Nellikallu", "Nomula", "Tatikal"],
      "Munugode": ["Chalimeda", "Gudur", "Kisan Nagar", "Koratikal", "Pulipalpula", "Singaram"],
      "Chandur": ["Bodanampalle", "Gundlepalle", "Kothapalle", "Nemmani", "Pullemla", "Theratpalle"],
      "Haliya (Anumula)": ["Anumula", "Chalaveedu", "Ibrahimpet", "Kamsanpalle", "Marepally", "Peraoor"],
      "Narketpally": ["Akkapally", "Bommireddigudem", "Cheruvugattu", "Madharam", "Nennur", "Shapalle"],
    },
    "Suryapet": {
      "Suryapet": ["Alavalapati", "Balemla", "Bibigudem", "Imampet", "Kasaram", "Pinnaipalle", "Tallakhammampadu"],
      "Kodad": ["Chimakuntla", "Dorakunta", "Gudibanda", "Kompally", "Kuchipudi", "Tamara"],
      "Huzurnagar": ["Amaravaram", "Gopalapuram", "Lakkavaram", "Mattampally", "Ponugodu", "Saidulu Cheruvu"],
      "Mothey": ["Appannapet", "Burkacharla", "Kothagudem", "Mamillagudem", "Singaram", "Vibhalapuram"],
      "Chivvemla": ["Aipur", "Chivvemla Rural", "Gumpula", "Kudakuda", "Thimmapuram", "Undrugonda"],
      "Garidepally": ["Appannapet", "Kalmalacheruvu", "Ponugodu", "Rayangudem", "Thimmapuram"],
    },
    "Mahabubnagar": {
      "Mahabubnagar": ["Appannapalle", "Bhoothpur", "Dharmapur", "Kothur", "Manikonda", "Yenugonda"],
      "Jadcherla": ["Badepalle", "Gangapur", "Kaverammapeta", "Macharam", "Nagireddipalle", "Polepalle"],
      "Bhoothpur": ["Ammapalle", "Devarkadra", "Karvena", "Pothulamadugu", "Sheriguda", "Thadiparparthy"],
      "Devarkadra": ["Baswapur", "Chinna Chintakunta", "Dokur", "Gopanpalle", "Kowkuntla", "Perur"],
      "Nawabpet": ["Akkampalle", "Chinnajangampalle", "Gollapalle", "Kakkalapalle", "Malkapur", "Vankadad"],
      "Koilkonda": ["Achampet", "Chandaipally", "Damannapet", "Lingupalle", "Manikonda", "Serivenkatapur"],
    },
    "Siddipet": {
      "Siddipet Urban": ["Bandacharla", "Imambad", "Mittapalle", "Narsapur", "Prashanthnagar", "Tadkapalle"],
      "Siddipet Rural": ["Chinnakodur", "Ensanpalle", "Irkode", "Mandapalle", "Pothireddypalle", "Pullur"],
      "Gajwel": ["Ahmadipur", "Bangaru Gadda", "Dharmaram", "Mutrajpalle", "Pragnapur", "Rimmanguda"],
      "Dubbak": ["Akbarpet", "Chellapur", "Dharmajipet", "Habshipur", "Kudavelli", "Lachapet"],
      "Husnabad": ["Akunoor", "Chigurumamidi", "Gouravelli", "Mirzapur", "Pandilla", "Potlapalle"],
      "Chinna Kodur": ["Allipur", "Gangapur", "Ibrahimbad", "Malyala", "Medipalle", "Sikindlapur"],
    },
    "Sangareddy": {
      "Sangareddy": ["Fasarabad", "Gulamaliguda", "Kalabgoor", "Kandi", "Pothireddypalle", "Tadlapalle"],
      "Zaheerabad": ["Allipur", "Badampet", "Didgi", "Ghotur", "Kohir", "Pastapur", "Ranjole"],
      "Patancheru": ["Bandlaguda", "Isnapur", "Muthangi", "Pashamylaram", "Pocharam", "Rudraram"],
      "Narayankhed": ["Abgunda", "Bhanapur", "Chandapur", "Kangti", "Manikpur", "Ryalamadugu"],
      "Andole (Jogipet)": ["Annaram", "Brahmanapalle", "Chintakunta", "Danampalle", "Kansanpalle", "Musalapur"],
      "Kandi": ["Arutla", "Cheriyal", "Erdanoor", "Kavalampet", "Mamillapalle", "Uttarpalle"],
    },
    "Medak": {
      "Medak": ["Ausulapalle", "Balampet", "Chityal", "Kuchanpalle", "Malkapur", "Perur", "Rayinapalle"],
      "Narsapur": ["Achampet", "Chinnachintakunta", "Moosapet", "Rustumpet", "Tuppran", "Yellammaguda"],
      "Tupran": ["Brahmanapalle", "Gundlapalle", "Ismailkhanpet", "Kistapur", "Malkapur", "Venkatapur"],
      "Ramayampet": ["Akkanapet", "Dharmaram", "Gollapalle", "Jhamsingh Lingapur", "Rayilapur", "Sutarpalle"],
      "Alladurg": ["Appajipalle", "Chilveri", "Gadi Peddapur", "Muslapur", "Rampur", "Yeldurthy"],
      "Kowdipalle": ["Dharmasagar", "Kandivanam", "Lingampalle", "Mohammad Nagar", "Venkatapur"],
    },
    "Jagtial": {
      "Jagtial": ["Dharmapuri", "Gollapalle", "Habshipur", "Kandlapalle", "Mothe", "Puranipet", "Tharigoppula"],
      "Korutla": ["Ailapur", "Chittapur", "Ibrahimpatnam", "Maddunoor", "Nagulapet", "Venkatapur"],
      "Metpally": ["Atmakur", "Chowlamaddi", "Jaggasagar", "Konaraopet", "Mettupalle", "Vellulla"],
      "Dharmapuri": ["Buggaram", "Donthapur", "Gollapalli", "Kamalapur", "Rayapatnam", "Thimmapur"],
      "Raikal": ["Allipur", "Bhoopathipur", "Itikyal", "Kattalingampet", "Moosapet", "Valgonda"],
      "Gollapalli": ["Chilvakodur", "Gonegandla", "Isrolpalle", "Mallannapet", "Thirumalapur"],
    },
    "Peddapalli": {
      "Peddapalli": ["Appannapet", "Bhojannapet", "Chinnakalvala", "Nimmanapalle", "Raghavapur", "Rangampalle"],
      "Ramagundam": ["Allur", "Godavarikhani", "Kundulpalle", "Malkapur", "Medipalli", "Polampalle"],
      "Manthani": ["Arenda", "Bhatpalle", "Gollapalle", "Khammampalle", "Nagaram", "Vilochavaram"],
      "Sultanabad": ["Bhoopathipur", "Garrepalle", "Kanukula", "Katnapalle", "Pocharam", "Srirampur"],
      "Julapalle": ["Abadi", "Chinnapur", "Kachapur", "Telukunta", "Vadapalle"],
      "Odela": ["Bheemaram", "Gummadidur", "Kolanoor", "Madaka", "Rampur", "Shanagonda"],
    },
    "Rajanna Sircilla": {
      "Sircilla": ["Boinpalle", "Chinnabonala", "Mandepalle", "Peddabonala", "Sardapur", "Thangallapalle"],
      "Vemulawada": ["Areddy", "Bollaram", "Cheppial", "Kodurupaka", "Marupaka", "Shatrajpalle"],
      "Chandurthi": ["Bandapalle", "Jogapur", "Lingampet", "Mallial", "Nafispet", "Rudrangi"],
      "Boinpally": ["Ananthapalle", "Burgupalle", "Korepalle", "Malkapur", "Vilochavaram"],
      "Yellareddypet": ["Almaspur", "Boppapur", "Gollapalle", "Padira", "Singaram", "Venkatapur"],
      "Kona Rao Pet": ["Bavusaipet", "Dharmaram", "Kanagarthi", "Mamidipalli", "Narsingapur"],
    },
    "Bhadradri Kothagudem": {
      "Kothagudem": ["Babu Camp", "Chunchupally", "Garimellapadu", "Laxmidevipally", "Rudrampur", "Suvarnapuram"],
      "Bhadrachalam": ["Chinna Nallabelli", "Dummugudem", "Kannaigudem", "Nellipaka", "Parnasala", "Venkatapuram"],
      "Yellandu": ["Boithapalli", "Komararam", "Mamidigudem", "Rompaid", "Sudimalla", "Usirikayalapalle"],
      "Palwancha": ["Danthalaboru", "Karakavagudem", "Pandurangapuram", "Seetharampuram", "Ulvanuru"],
      "Manuguru": ["Aswapuram", "Bugga", "Chinnaravigudem", "Kondapuram", "Pagideru", "Samithi Singaram"],
      "Burgampahad": ["Gannavaram", "Iravandi", "Morampalli Banjara", "Nagineniprolu", "Sarapaka"],
      "Aswapuram": ["Amaravaram", "Chintiryala", "Gondi", "Mondi Konda", "Nellipaka"],
    },
    "Adilabad": {
      "Adilabad Urban": ["Ankoli", "Battisavargaon", "Chanda", "Kachkanti", "Mavala", "Tantoli"],
      "Adilabad Rural": ["Bela", "Borpally", "Ghattu", "Koilguda", "Pipri", "Rampur", "Yapalguda"],
      "Boath": ["Bablagaon", "Dhanora", "Kanthi", "Marnaguda", "Pardi", "Sonala"],
      "Bazarhathnoor": ["Balanpur", "Chikili", "Dedra", "Ghatkoli", "Manikpur", "Morakhandi"],
      "Utnoor": ["Ghanpur", "Hasnapur", "Indravelli", "Lakkaram", "Narsapur", "Shampur"],
      "Ichoda": ["Adegaon", "Dhabha", "Girjam", "Keshavpatnam", "Mankapur", "Sirikonda"],
    },
    "Nirmal": {
      "Nirmal": ["Ananthpet", "Chityal", "Kondapur", "Manjulapur", "Medpalle", "Siddapur"],
      "Bhainsa": ["Babhulgaon", "Gundegaon", "Kumbhi", "Mahagaon", "Pardi", "Sirala"],
      "Khanapur": ["Badankurthy", "Dharmaraopet", "Iqbalpur", "Mandapalle", "Surjapur"],
      "Mudhole": ["Basar", "Bichkunda", "Edbid", "Kallur", "Machapur", "Vittalpur"],
      "Sarangapur": ["Alisagar", "Chincholi", "Kankata", "Potharam", "Swarna"],
      "Kaddampeddur": ["Amballi", "Bheemaram", "Devuniguda", "Konampet", "Pandvapur"],
    },
    "Mancherial": {
      "Mancherial": ["Andugulapet", "Chunambatti", "Gadhpur", "Hajipur", "Naspur", "Thimmapur"],
      "Bellampalli": ["Akkapalle", "Budakalan", "Chinnagudur", "Dharmaraopet", "Kannal", "Rangapet"],
      "Mandamarri": ["Andugulapalli", "Chirrakunta", "Kasipet", "Mamidigadda", "Sarvaipet"],
      "Chennur": ["Asnad", "Chintalapalle", "Kotapalle", "Potharam", "Suddala"],
      "Luxettipet": ["Challampeta", "Dowdepalle", "Gullakota", "Modela", "Utkur"],
      "Jannaram": ["Indanpalle", "Kalmadugu", "Kawal", "Morangapalle", "Singaraopeta"],
    },
    "Kumuram Bheem Asifabad": {
      "Asifabad": ["Ada", "Babapur", "Chilpurguda", "Danabhadra", "Mankuguda", "Wankidi"],
      "Kagaznagar": ["Ankoda", "Bhatpalle", "Chintaguda", "Easgaon", "Kosini", "Musalapalle"],
      "Sirpur (T)": ["Chintaladhaba", "Dhaba", "Hudkili", "Lonavelli", "Pardhi", "Tonkini"],
      "Rebbena": ["Goleti", "Kondapalle", "Nandlapalle", "Pullagaon", "Takallapalle"],
      "Kerameri": ["Devapur", "Indapur", "Jhiri", "Modi", "Parandoli", "Surdapur"],
      "Jainoor": ["Adasampalle", "Dubbaguda", "Jamgaon", "Marlavai", "Panchguda"],
    },
    "Kamareddy": {
      "Kamareddy": ["Adloor", "Devunipally", "Gargul", "Kyasampally", "Lingapur", "Rameshwarpally"],
      "Banswada": ["Borlam", "Chinna Taduru", "Desaipet", "Kollur", "Malyal", "Someshwar"],
      "Yellareddy": ["Bhavanipet", "Gandhari", "Kalyani", "Laxmapur", "Mathmal", "Timmapur"],
      "Pitlam": ["Chillarchedu", "Godamgaon", "Hasnapur", "Kurti", "Maddelcheru", "Siddapur"],
      "Bhiknoor": ["Baswapur", "Chinna Mallareddy", "Gurjakunta", "Kachapur", "Ryalamadugu"],
      "Madnoor": ["Awalgaon", "Bichkunda", "Dongli", "Gojegaon", "Mogha", "Salabatpur"],
    },
    "Mahabubabad": {
      "Mahabubabad": ["Anantharam", "Bethole", "Jamandlapalle", "Malyala", "Mudupugal", "Salarpalle"],
      "Kesamudram": ["Arpanapalle", "Berada", "Dhanasari", "Intikanne", "Korukondapalle", "Rangapuram"],
      "Dornakal": ["Burhanpur", "Chilkod", "Gollacharla", "Khammampadu", "Marriguda", "Perumandla"],
      "Kuravi": ["Balapala", "Chinnamadur", "Gundepudi", "Kandlagunta", "Modugulagudem", "Seerole"],
      "Narsimhulapet": ["Agarampalle", "Danampalle", "Jayapuram", "Kommulavancha", "Peddanagaram"],
      "Bayyaram": ["Garla", "Gauthanapalle", "Kachanapalle", "Miryala", "Motlathimmapuram"],
    },
    "Jayashankar Bhupalpally": {
      "Bhupalpally": ["Ambatpally", "Gorlaveedu", "Jangidipally", "Kamalapur", "Moranchapalle", "Peddapur"],
      "Kataram": ["Brahmana Palli", "Chintakani", "Dhanwada", "Kaleshwaram", "Medaram", "Sundarajupet"],
      "Mahadevpur": ["Ambatpally", "Annaram", "Bommepally", "Kaleshwaram", "Suraram", "Tharigoppula"],
      "Mogullapally": ["Anantharam", "Ganeshpur", "Motlapalle", "Potharam", "Rangapuram", "Venkatapur"],
      "Tekumatla": ["Asifnagar", "Dubbagula", "Garlapalle", "Kundanpally", "Raghavapur"],
      "Malhar Rao": ["Edlapally", "Kondampeta", "Manthani Khurd", "Rampur", "Tadicherla"],
    },
    "Mulugu": {
      "Mulugu": ["Bandaru", "Chinnakodepaka", "Govindaraopet", "Incherla", "Madaguda", "Pathipaka"],
      "Venkatapur (Ramappa)": ["Baghbanpally", "Kothaguda", "Laknavaram", "Nallagunta", "Palampet", "Ramanakkapet"],
      "Govindaraopet": ["Chalvai", "Gundam", "Karlapalle", "Pasra", "Rangapur", "Thimmampet"],
      "Tadvai (Sammakka Saralamma)": ["Bayyakkapet", "Katapur", "Medaram", "Oorattam", "Project Nagar"],
      "Eturnagaram": ["Allamvarigudem", "Chinnaboinapally", "Kannaigudem", "Ramannagudem", "Roheer"],
      "Mangapet": ["Cherupalle", "Domeda", "Kathigudem", "Kommanapalle", "Mallur", "Thimmampet"],
    },
    "Jangaon": {
      "Jangaon": ["Chowdaram", "Gundlapalle", "Marigadi", "Nawabpet", "Peddaramcherla", "Yeshwanthapur"],
      "Station Ghanpur": ["Chagallu", "Ippaguda", "Madikonda", "Malkapur", "Samudrala", "Shivunipalle"],
      "Palakurthy": ["Chennur", "Dharmapuram", "Kadalivanam", "Mutharam", "Torrur", "Valmidi"],
      "Devaruppula": ["Chinnamaduru", "Kadivendi", "Kamarla", "Mylaram", "Peddamaduru", "Singarajupalle"],
      "Bachannapet": ["Alimpur", "Bandanagaram", "Itikyal", "Kachapur", "Potharam", "Ramakkapet"],
      "Zaffergadh": ["Alair", "Konaichalam", "Raghunathpalle", "Saganapalle", "Thimmapur", "Uppagal"],
    },
    "Yadadri Bhuvanagiri": {
      "Bhongir (Bhuvanagiri)": ["Anantharam", "Bollepalle", "Bommalaramaram", "Munigadapa", "Rayagiri", "Tukkapur"],
      "Alair": ["Bahadoorpet", "Gollapalle", "Kaloor", "Manthapuri", "Sharbanapuram", "Turpugudem"],
      "Choutuppal": ["Aregudem", "Dharmalingam", "Gokaram", "Lingojigudem", "Malkapur", "Panthangi", "Tangadpally"],
      "Yadagirigutta": ["Datarpalle", "Gundlapalle", "Kacharam", "Mallapur", "Raigir", "Vangapalle"],
      "Mothkur": ["Anantharam", "Dacharam", "Kondagadapa", "Musipatla", "Panigiri", "Ramachandrapuram"],
      "Ramannapet": ["Bogaram", "Chinnakaparthy", "Kakarlapahad", "Nidhanpalle", "Siripuram", "Yellanki"],
    },
    "Jogulamba Gadwal": {
      "Gadwal": ["Alampur", "Ananthapur", "Dharoor", "Gattu", "Itikyala", "Kondapalle", "Maldakal"],
      "Alampur": ["Bheemavaram", "Bukkapuram", "Gingirala", "Kyatur", "Manopad", "Rajarampuram", "Undavelli"],
      "Maldakal": ["Bijwaram", "Edulapalle", "Kuruvapuram", "Mallampalle", "Saddalonipally", "Vaddepalle"],
      "Itikyal": ["Batladinne", "Garlapadu", "Kondur", "Munagala", "Peddadinne", "Shabad"],
      "Gattu": ["Alur", "Boyalagudem", "Chintakunta", "Gorlakhanpalle", "Induvasi", "Macharla"],
      "Ieeja": ["Ameenpur", "Chinna Dhanwada", "Kallur", "Medikonda", "Pedda Thandrapadu", "Yapadinne"],
    },
    "Wanaparthy": {
      "Wanaparthy": ["Appaipalle", "Chityala", "Kadukuntla", "Nancharamma Gudem", "Rajapet", "Srinivasa Puram"],
      "Pebbair": ["Bollavaram", "Chelimilla", "Garlapadu", "Munagala", "Rampur", "Yaparla"],
      "Ghanpur": ["Alwal", "Appannapalle", "Kondapalle", "Malkapur", "Sultanpur", "Venkatampalle"],
      "Gopalpeta": ["Chinnadarpalle", "Edula", "Jadcherla", "Nagasanpalle", "Polikehad", "Tadparthy"],
      "Kothakota": ["Apparala", "Kanimetta", "Mirzapur", "Natarajpalli", "Palem", "Rayannapet"],
      "Pangal": ["Balanur", "Chinnambavi", "Davulapally", "Kadavakollu", "Madhavaraopally"],
    },
    "Nagarkurnool": {
      "Nagarkurnool": ["Alair", "Bijinapalle", "Deshithimmmapur", "Gaggalapalle", "Nandivadman", "Uyyalawada"],
      "Achampet": ["Amrabad", "Bommireddipalle", "Chintalapadu", "Dindi", "Mannanur", "Padara"],
      "Kalwakurthy": ["Gundlapalle", "Jeedipally", "Marchala", "Mukurala", "Raghupathipeta", "Taroor"],
      "Kollapur": ["Bobbepalle", "Chinna Marur", "Enmanbetla", "Kudikilla", "Pedda Marur", "Singotam"],
      "Bijinapalle": ["Chinnakarpula", "Gangaram", "Karakonda", "Lattupalle", "Mamidipally", "Vaddeman"],
      "Amrabad (Nallamala)": ["Appapur", "Farhabad", "Maddimadugu", "Mannanur", "Srisailam Border", "Vatwarlapalle"],
    },
    "Narayanpet": {
      "Narayanpet": ["Abhangapur", "Bhairampalle", "Chinnajatram", "Jalamangalam", "Kollampalle", "Sataram"],
      "Makthal": ["Amanagallu", "Chinnagopulapuram", "Gudigandla", "Jakler", "Musalayapalle", "Panchalingala"],
      "Kosgi": ["Achanpalle", "Boganiguda", "Kadpal", "Lodhipur", "Mirzapur", "Sarjakhanpet"],
      "Maddur": ["Appampalle", "Damaragidda", "Dharmapur", "Kistapur", "Mominapur", "Renivatla"],
      "Damaragidda": ["Akanpalle", "Bannoor", "Kandloor", "Mallareddipalle", "Nizampur", "Ullegundam"],
      "Utkoor": ["Chinnapoor", "Gollapalle", "Kollampalle", "Magnoor", "Nidigonda", "Pulimaddi"],
    },
    "Vikarabad": {
      "Vikarabad": ["Alampalle", "Attapur", "Dharmapur", "Godumakunta", "Madanpalle", "Pudur", "Sidloor"],
      "Tandur": ["Basheerabad", "Chincholi", "Goutapur", "Karanjote", "Malreddipally", "Ogipur", "Yalal"],
      "Parigi": ["Chityal", "Govindapur", "Kullur", "Malkapur", "Naskal", "Rakhonda", "Sulthanpur"],
      "Kodangal": ["Appayapalle", "Bommanpad", "Dudyal", "Hasnapur", "Kollur", "Mamidlapalle", "Ravulapalle"],
      "Mominpet": ["Amrad Kalan", "Chiluvur", "Enkathala", "Govindaraopet", "Kekatloor", "Tekulapalle"],
      "Nawabpet": ["Akkampalle", "Chityal", "Ekmaimiddi", "Lingampalle", "Pothireddipalle", "Yellakonda"],
    },
    "Ranga Reddy": {
      "Chevella": ["Alur", "Chanvelli", "Devuniguda", "Kandawada", "Mudimyal", "Pamena", "Shabad"],
      "Shadnagar (Farooqnagar)": ["Chityal", "Elikatta", "Kishannagar", "Mogalagidda", "Rameshwaram", "Solipur"],
      "Ibrahimpatnam": ["Adibatla", "Bongloor", "Dandumailaram", "Kongar Kalan", "Pocharam", "Turkayamjal"],
      "Maheshwaram": ["Akulamailaram", "Dubbacherla", "Kandukur", "Mankhal", "Mohabbatnagar", "Thimmapur"],
      "Rajendranagar": ["Bandlaguda Jagir", "Budwel", "Gaganpahad", "Himayatsagar", "Kattedan", "Shamshabad"],
      "Moinabad": ["Amangal", "Bakaram", "Chilkur", "Kanakamamidi", "Nakkalapalle", "Surangal", "Tolkatta"],
      "Shabad": ["Chandanvelle", "Damaragidda", "Kakloor", "Maddur", "Nagarkunta", "Polkampalle"],
    },
    "Medchal-Malkajgiri": {
      "Medchal": ["Akbarja", "Athvelly", "Dabilpur", "Gundlapochampally", "Munanagar", "Pudur", "Sutari"],
      "Shamirpet": ["Aliabad", "Babaguda", "Jaganguda", "Kolthur", "Lalgadi Malakpet", "Muduchintalapalli"],
      "Ghatkesar": ["Ankushapur", "Aushapur", "Edulabad", "Kondapur", "Korremula", "Pratapsingaram"],
      "Keesara": ["Ankireddypally", "Bogaram", "Cheeryal", "Godhumakunta", "Nagaram", "Rampally"],
      "Quthbullapur": ["Bowrampet", "Dommara Pochampally", "Dundigal", "Gagillapur", "Mallampet", "Sambhupur"],
      "Alwal": ["Bolarum", "Kavalbyrasandra", "Machabollaram", "Macha Bolarum", "Turkapally"],
    },
    "Hyderabad": {
      "Hyderabad Central": ["Amberpet", "Asifnagar", "Bahadurpura", "Charminar", "Golconda", "Khairatabad", "Musheerabad", "Saidabad"],
    },
  },
};

// Complete Exhaustive Crop Catalog Across Andhra Pradesh & Telangana
// Covering every single agricultural, horticultural, plantation, pulse, oilseed, spice, and vegetable crop yielded in AP & Telangana.
export const EXHAUSTIVE_CROPS: CropItem[] = [
  // 1. CEREALS & MILLETS
  { name: "Paddy / Rice", teluguName: "వరి", category: "Cereals & Millets", tag: "Primary Staple Food", key: "rice", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Maize / Corn", teluguName: "మొక్కజొన్న", category: "Cereals & Millets", tag: "High-Yield Coarse Grain", key: "maize", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Jowar / Sorghum", teluguName: "జొన్న", category: "Cereals & Millets", tag: "Drought-Resilient Millet", key: "jowar", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Bajra / Pearl Millet", teluguName: "సజ్జ", category: "Cereals & Millets", tag: "Nutri-Cereal Millet", key: "bajra", majorSeasons: ["Kharif", "Summer"] },
  { name: "Ragi / Finger Millet", teluguName: "రాగి / చోళ్ళు", category: "Cereals & Millets", tag: "Calcium-Rich Super Millet", key: "ragi", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Foxtail Millet / Korralu", teluguName: "కొర్రలు", category: "Cereals & Millets", tag: "Ancient Healthy Millet", key: "korralu", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Little Millet / Samalu", teluguName: "సామలు", category: "Cereals & Millets", tag: "Rainfed Nutri-Millet", key: "samalu", majorSeasons: ["Kharif"] },
  { name: "Kodo Millet / Arikelu", teluguName: "అరికెలు", category: "Cereals & Millets", tag: "Fiber-Rich Siridhanya", key: "arikelu", majorSeasons: ["Kharif"] },
  { name: "Barnyard Millet / Oodalu", teluguName: "ఊదలు", category: "Cereals & Millets", tag: "Fast-Maturing Millet", key: "oodalu", majorSeasons: ["Kharif"] },
  { name: "Proso Millet / Varigalu", teluguName: "వరిగలు", category: "Cereals & Millets", tag: "Short-Duration Millet", key: "varigalu", majorSeasons: ["Rabi"] },
  { name: "Wheat", teluguName: "గోధుమ", category: "Cereals & Millets", tag: "Northern Zone Cereal", key: "wheat", majorSeasons: ["Rabi"] },

  // 2. PULSES
  { name: "Red Gram / Pigeon Pea / Toor", teluguName: "కంది", category: "Pulses", tag: "Major Protein Crop", key: "red_gram", majorSeasons: ["Kharif"] },
  { name: "Bengal Gram / Chickpea / Chana", teluguName: "శనగ", category: "Pulses", tag: "Premier Rabi Pulse", key: "bengal_gram", majorSeasons: ["Rabi"] },
  { name: "Black Gram / Urad Dal", teluguName: "మినుము", category: "Pulses", tag: "Rice Fallow Pulse", key: "black_gram", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Green Gram / Moong Dal", teluguName: "పెసర", category: "Pulses", tag: "Short Duration Catch Crop", key: "green_gram", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Horse Gram / Ulavalu", teluguName: "ఉలవలు", category: "Pulses", tag: "Hardy Dryland Pulse", key: "horse_gram", majorSeasons: ["Rabi"] },
  { name: "Cowpea / Alasandalu", teluguName: "అలసందలు / బొబ్బర్లు", category: "Pulses", tag: "Vegetable & Grain Pulse", key: "cowpea", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Field Pea / Batani", teluguName: "బఠానీ", category: "Pulses", tag: "Winter Pulse", key: "field_pea", majorSeasons: ["Rabi"] },

  // 3. OILSEEDS
  { name: "Groundnut / Peanut", teluguName: "వేరుశనగ", category: "Oilseeds", tag: "Premier Cash Oilseed", key: "groundnut", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Soybean", teluguName: "సోయాబీన్", category: "Oilseeds", tag: "High Protein & Oil Crop", key: "soybean", majorSeasons: ["Kharif"] },
  { name: "Sunflower", teluguName: "పొద్దుతిరుగుడు", category: "Oilseeds", tag: "Edible Oilseed", key: "sunflower", majorSeasons: ["Rabi", "Summer"] },
  { name: "Sesame / Gingelly / Til", teluguName: "నువ్వులు", category: "Oilseeds", tag: "High Value Oilseed", key: "sesame", majorSeasons: ["Rabi", "Summer"] },
  { name: "Castor", teluguName: "ఆముదం", category: "Oilseeds", tag: "Industrial Oilseed", key: "castor", majorSeasons: ["Kharif"] },
  { name: "Mustard / Rapeseed", teluguName: "ఆవాలు", category: "Oilseeds", tag: "Rabi Oilseed", key: "mustard", majorSeasons: ["Rabi"] },
  { name: "Safflower / Kusuma", teluguName: "కుసుమ", category: "Oilseeds", tag: "Drought Tolerant Oilseed", key: "safflower", majorSeasons: ["Rabi"] },
  { name: "Oil Palm", teluguName: "ఆయిల్ పామ్", category: "Oilseeds", tag: "Perennial High-Yield Oil Crop", key: "oil_palm", majorSeasons: ["Kharif", "Rabi", "Summer"] },

  // 4. COMMERCIAL & FIBER CROPS
  { name: "Cotton", teluguName: "పత్తి", category: "Commercial & Fiber", tag: "White Gold Commercial Fiber", key: "cotton", majorSeasons: ["Kharif"] },
  { name: "Sugarcane", teluguName: "చెరకు", category: "Commercial & Fiber", tag: "Perennial Sugar Crop", key: "sugarcane", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Tobacco / Virginia Tobacco", teluguName: "పొగాకు", category: "Commercial & Fiber", tag: "Export Cash Crop", key: "tobacco", majorSeasons: ["Rabi"] },
  { name: "Jute / Mesta / Gogu", teluguName: "గోగు / జనపనార", category: "Commercial & Fiber", tag: "Natural Bast Fiber", key: "jute", majorSeasons: ["Kharif"] },
  { name: "Mulberry / Sericulture", teluguName: "మల్బరీ / పట్టు", category: "Commercial & Fiber", tag: "Silk Farming Foliage", key: "mulberry", majorSeasons: ["Kharif", "Rabi", "Summer"] },

  // 5. SPICES & CONDIMENTS
  { name: "Red Chilli", teluguName: "మిరప", category: "Spices & Condiments", tag: "Famous Commercial Spice", key: "chilli", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Turmeric", teluguName: "పసుపు", category: "Spices & Condiments", tag: "Golden Rhizome Spice", key: "turmeric", majorSeasons: ["Kharif"] },
  { name: "Ginger", teluguName: "అల్లం", category: "Spices & Condiments", tag: "Aromatic Rhizome Cash Crop", key: "ginger", majorSeasons: ["Kharif"] },
  { name: "Garlic", teluguName: "వెల్లుల్లి", category: "Spices & Condiments", tag: "Bulb Spice", key: "garlic", majorSeasons: ["Rabi"] },
  { name: "Coriander / Dhaniya", teluguName: "ధనియాలు", category: "Spices & Condiments", tag: "Seed & Leaf Spice", key: "coriander", majorSeasons: ["Rabi"] },
  { name: "Cumin / Jeera", teluguName: "జీలకర్ర", category: "Spices & Condiments", tag: "Aromatic Spice", key: "cumin", majorSeasons: ["Rabi"] },
  { name: "Fenugreek / Menthulu", teluguName: "మెంతులు", category: "Spices & Condiments", tag: "Leafy & Seed Spice", key: "fenugreek", majorSeasons: ["Rabi"] },
  { name: "Black Pepper", teluguName: "మిరియాలు", category: "Spices & Condiments", tag: "Agency Tract Spice", key: "pepper", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Ajwain / Vamu", teluguName: "వాము", category: "Spices & Condiments", tag: "Medicinal Spice", key: "ajwain", majorSeasons: ["Rabi"] },

  // 6. HORTICULTURE, FRUITS & PLANTATION
  { name: "Mango / Banginapalli", teluguName: "మామిడి", category: "Fruits & Plantation", tag: "King of Fruits (AP Specialty)", key: "mango", majorSeasons: ["Summer"] },
  { name: "Sweet Orange / Mosambi / Sathgudi", teluguName: "బత్తాయి", category: "Fruits & Plantation", tag: "Citrus Fruit Orchard", key: "sweet_orange", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Acid Lime / Lemon", teluguName: "నిమ్మ", category: "Fruits & Plantation", tag: "Commercial Citrus", key: "lemon", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Banana", teluguName: "అరటి", category: "Fruits & Plantation", tag: "Perennial High-Value Fruit", key: "banana", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Pomegranate", teluguName: "దానిమ్మ", category: "Fruits & Plantation", tag: "Arid Zone Orchard", key: "pomegranate", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Papaya", teluguName: "బొప్పాయి", category: "Fruits & Plantation", tag: "Continuous Yield Fruit", key: "papaya", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Guava", teluguName: "జామ", category: "Fruits & Plantation", tag: "Hardy Fruit Orchard", key: "guava", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Sapota / Chiku", teluguName: "సపోటా", category: "Fruits & Plantation", tag: "Sweet Orchard Fruit", key: "sapota", majorSeasons: ["Kharif", "Summer"] },
  { name: "Custard Apple / Sitaphal", teluguName: "సీతాఫలం", category: "Fruits & Plantation", tag: "Native Dryland Fruit", key: "custard_apple", majorSeasons: ["Kharif"] },
  { name: "Watermelon", teluguName: "పుచ్చకాయ", category: "Fruits & Plantation", tag: "Summer Cash Fruit", key: "watermelon", majorSeasons: ["Summer"] },
  { name: "Muskmelon / Kharbooja", teluguName: "కర్బూజ", category: "Fruits & Plantation", tag: "Short Duration Melon", key: "muskmelon", majorSeasons: ["Summer"] },
  { name: "Grapes", teluguName: "ద్రాక్ష", category: "Fruits & Plantation", tag: "Vineyard Horticulture", key: "grapes", majorSeasons: ["Rabi", "Summer"] },
  { name: "Cashew Nut", teluguName: "జీడిమామిడి", category: "Fruits & Plantation", tag: "Coastal & Agency Nut", key: "cashew", majorSeasons: ["Summer"] },
  { name: "Coconut", teluguName: "కొబ్బరి", category: "Fruits & Plantation", tag: "Coastal Plantation Crop", key: "coconut", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Betel Vine / Tamalapaku", teluguName: "తమలపాకు", category: "Fruits & Plantation", tag: "Intensive Commercial Vine", key: "betel_vine", majorSeasons: ["Kharif", "Rabi", "Summer"] },

  // 7. VEGETABLES
  { name: "Tomato", teluguName: "టమాట", category: "Vegetables", tag: "Everyday Commercial Vegetable", key: "tomato", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Onion", teluguName: "ఉల్లిపాయ", category: "Vegetables", tag: "Crucial Kitchen Bulb", key: "onion", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Bhendi / Okra / Ladies Finger", teluguName: "బెండకాయ", category: "Vegetables", tag: "Warm Season Vegetable", key: "bhendi", majorSeasons: ["Kharif", "Summer"] },
  { name: "Brinjal / Eggplant", teluguName: "వంకాయ", category: "Vegetables", tag: "Widely Cultivated Vegetable", key: "brinjal", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Green Chilli", teluguName: "పచ్చిమిర్చి", category: "Vegetables", tag: "Fresh Market Spice Vegetable", key: "green_chilli", majorSeasons: ["Kharif", "Rabi"] },
  { name: "Potato", teluguName: "బంగాళాదుంప", category: "Vegetables", tag: "Tuber Vegetable", key: "potato", majorSeasons: ["Rabi"] },
  { name: "Cabbage", teluguName: "క్యాబేజీ", category: "Vegetables", tag: "Cole Vegetable", key: "cabbage", majorSeasons: ["Rabi"] },
  { name: "Cauliflower", teluguName: "కాలీఫ్లవర్", category: "Vegetables", tag: "Winter Vegetable", key: "cauliflower", majorSeasons: ["Rabi"] },
  { name: "Carrot", teluguName: "క్యారెట్", category: "Vegetables", tag: "Root Vegetable", key: "carrot", majorSeasons: ["Rabi"] },
  { name: "Bottle Gourd / Sorakaya", teluguName: "సొరకాయ / ఆనపకాయ", category: "Vegetables", tag: "Cucurbit Vine Vegetable", key: "bottle_gourd", majorSeasons: ["Kharif", "Summer"] },
  { name: "Bitter Gourd / Kakarakaya", teluguName: "కాకరకాయ", category: "Vegetables", tag: "Medicinal Vine Vegetable", key: "bitter_gourd", majorSeasons: ["Kharif", "Summer"] },
  { name: "Ridge Gourd / Beerakaya", teluguName: "బీరకాయ", category: "Vegetables", tag: "Tender Vine Vegetable", key: "ridge_gourd", majorSeasons: ["Kharif", "Summer"] },
  { name: "Ivy Gourd / Dondakaya", teluguName: "దొండకాయ", category: "Vegetables", tag: "Perennial High-Frequency Harvest", key: "ivy_gourd", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Drumstick / Munakkaya", teluguName: "మునగకాయ", category: "Vegetables", tag: "Perennial Tree Vegetable", key: "drumstick", majorSeasons: ["Kharif", "Summer"] },
  { name: "Spinach / Palakura", teluguName: "పాలకూర", category: "Vegetables", tag: "Fast Harvest Green Leafy", key: "palakura", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Gongura / Roselle", teluguName: "గోంగూర", category: "Vegetables", tag: "Iconic Telugu Sour Leaf", key: "gongura", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Amaranthus / Thotakura", teluguName: "తోటకూర", category: "Vegetables", tag: "Popular Nutritious Greens", key: "thotakura", majorSeasons: ["Kharif", "Rabi", "Summer"] },
  { name: "Curry Leaf / Karivepaku", teluguName: "కరివేపాకు", category: "Vegetables", tag: "Commercial Leafy Crop", key: "curry_leaf", majorSeasons: ["Kharif", "Rabi", "Summer"] },
];

export const ALL_STATES = Object.keys(REGIONAL_HIERARCHY);

export function getDistrictsForState(state: string): string[] {
  const data = REGIONAL_HIERARCHY[state];
  return data ? Object.keys(data).sort() : [];
}

export function getMandalsForDistrict(state: string, district: string): string[] {
  const stateData = REGIONAL_HIERARCHY[state];
  if (!stateData) return [];
  const districtData = stateData[district];
  return districtData ? Object.keys(districtData).sort() : [];
}

export function getVillagesForMandal(state: string, district: string, mandal: string): string[] {
  const stateData = REGIONAL_HIERARCHY[state];
  if (!stateData) return [];
  const districtData = stateData[district];
  if (!districtData) return [];
  const villages = districtData[mandal];
  return villages ? [...villages].sort() : [];
}
