/* Point features for the atlas & quizzes. [lat, lon] are approximate locator points (not survey-grade).
   cat: peak | pass | glacier | lake | fall | dam | city | island | coast
   st = state / region · rv = river (for dam/city/fall) · info = short study note · clues = identifying statements */
(function(){
const P=[];
const add=(cat,name,lat,lon,o)=>P.push(Object.assign({cat,name,ll:[lat,lon],id:cat+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')},o||{}));

/* ── PEAKS ── */
add('peak','Kangchenjunga',27.70,88.15,{h:8586,rng:'Eastern Himalaya (Himadri)',st:'Sikkim',info:'Highest peak in India; 3rd highest in the world.',clues:['Highest peak located in India (Sikkim–Nepal border)']});
add('peak','Nanda Devi',30.37,79.97,{h:7816,rng:'Great Himalaya (Kumaon)',st:'Uttarakhand',info:'Highest peak lying wholly within India; Nanda Devi National Park / Biosphere Reserve.',clues:['Highest peak wholly within India']});
add('peak','K2 (Godwin-Austen)',35.88,76.51,{h:8611,rng:'Karakoram',st:'Gilgit-Baltistan (PoK, claimed by India)',info:'Highest peak of the Karakoram; 2nd highest in the world. Lies in Gilgit-Baltistan, which India claims as part of J&K/Ladakh.',clues:['Highest peak in the Karakoram range','Also called Mt Godwin-Austen']});
add('peak','Kamet',30.92,79.59,{h:7756,rng:'Zaskar range (Great Himalaya)',st:'Uttarakhand',info:'Second-highest peak in Uttarakhand after Nanda Devi.',clues:['Zaskar range peak in Uttarakhand, near the Tibet border']});
add('peak','Saltoro Kangri',35.40,76.84,{h:7742,rng:'Saltoro range (Karakoram)',st:'Ladakh',info:'Highest peak of the Saltoro range, west of Siachen.',clues:['Highest peak of the Saltoro ridge near Siachen']});
add('peak','Saser Kangri',34.87,77.75,{h:7672,rng:'Saser Muztagh (Karakoram)',st:'Ladakh',info:'Highest peak of the Saser Muztagh, Ladakh.',clues:['Highest peak in the Saser Muztagh, Nubra region']});
add('peak','Nun Kun',34.00,76.02,{h:7135,rng:'Zaskar range (Great Himalaya)',st:'Ladakh',info:'Highest peaks of the Kashmir Himalaya (Nun 7,135 m; Kun 7,077 m), Zanskar.',clues:['Twin peaks in Kargil/Zanskar region']});
add('peak','Trisul',30.31,79.77,{h:7120,rng:'Great Himalaya (Kumaon)',st:'Uttarakhand',info:'Three-pronged peak; Pindari region.',clues:['Peak named after Shiva’s trident, Uttarakhand']});
add('peak','Anamudi',10.17,77.06,{h:2695,rng:'Anamalai Hills, Western Ghats',st:'Kerala',info:'Highest peak in South India and in the Western Ghats / peninsular India.',clues:['Highest peak of peninsular India']});
add('peak','Doddabetta',11.40,76.74,{h:2637,rng:'Nilgiri Hills',st:'Tamil Nadu',info:'Highest peak of the Nilgiris; near Ooty. Nilgiri is where Eastern and Western Ghats meet.',clues:['Highest peak of the Nilgiri Hills near Ooty']});
add('peak','Mullayanagiri',13.39,75.72,{h:1930,rng:'Baba Budan Giri, Western Ghats',st:'Karnataka',info:'Highest peak in Karnataka.',clues:['Highest peak in Karnataka (Chikkamagaluru)']});
add('peak','Kalsubai',19.60,73.70,{h:1646,rng:'Sahyadri, Western Ghats',st:'Maharashtra',info:'Highest peak in Maharashtra; “Everest of Maharashtra”.',clues:['Highest peak in Maharashtra, Akole']});
add('peak','Guru Shikhar',24.65,72.78,{h:1722,rng:'Aravalli Range (Mount Abu)',st:'Rajasthan',info:'Highest peak of the Aravalli range.',clues:['Highest peak of the Aravalli, at Mount Abu']});
add('peak','Dhupgarh',22.45,78.43,{h:1350,rng:'Satpura Range (Pachmarhi)',st:'Madhya Pradesh',info:'Highest peak of the Satpura range, near Pachmarhi.',clues:['Highest peak of the Satpura range']});
add('peak','Mahendragiri',18.97,84.37,{h:1501,rng:'Eastern Ghats',st:'Odisha',info:'Highest peak of the Eastern Ghats in Odisha (some sources: Arma Konda / Jindhagada in Andhra Pradesh).',clues:['Often cited as the highest peak of the Eastern Ghats (Odisha)']});
add('peak','Shillong Peak',25.55,91.88,{h:1961,rng:'Meghalaya Plateau (Khasi Hills)',st:'Meghalaya',info:'Highest point of the Shillong plateau.',clues:['Highest point of the Khasi Hills near Shillong']});
add('peak','Dapha Bum',27.95,96.20,{h:4578,rng:'Patkai Bum range (Purvanchal)',st:'Arunachal Pradesh',info:'Highest peak of the Patkai range in Arunachal Pradesh.',clues:['Highest peak of the Patkai Bum range']});
add('peak','Saramati',25.75,95.04,{h:3826,rng:'Naga Hills (Purvanchal)',st:'Nagaland',info:'Highest peak of Nagaland, on the Myanmar border.',clues:['Highest peak of the Naga Hills / Nagaland']});
add('peak','Phawngpui (Blue Mountain)',22.62,93.04,{h:2157,rng:'Mizo Hills (Purvanchal)',st:'Mizoram',info:'Highest peak in Mizoram.',clues:['Highest peak of Mizoram, the “Blue Mountain”']});

/* ── PASSES ── */
add('pass','Banihal Pass',33.50,75.20,{rng:'Pir Panjal',st:'Jammu and Kashmir',info:'Connects Jammu with the Kashmir Valley; Jawahar Tunnel / Banihal–Qazigund tunnel.',clues:['Pir Panjal pass linking Jammu and the Kashmir valley']});
add('pass','Zoji La',34.28,75.47,{rng:'Great Himalaya (Zaskar)',st:'J&K–Ladakh',info:'Links Srinagar with Kargil and Leh; Zojila tunnel under construction.',clues:['Links Srinagar and Leh (Kashmir–Ladakh)']});
add('pass','Khardung La',34.28,77.60,{rng:'Ladakh Range',st:'Ladakh',info:'Leh to Nubra valley; among the world’s highest motorable passes.',clues:['Leh–Nubra valley pass across the Ladakh range']});
add('pass','Chang La',34.04,77.93,{rng:'Ladakh Range',st:'Ladakh',info:'Leh to Pangong Tso route.',clues:['Pass on the way from Leh to Pangong Tso']});
add('pass','Taglang La',33.51,77.77,{rng:'Zaskar Range',st:'Ladakh',info:'On the Manali–Leh highway.',clues:['High pass on the Manali–Leh highway in Ladakh']});
add('pass','Baralacha La',32.76,77.42,{rng:'Zaskar Range',st:'Himachal Pradesh',info:'Links Lahaul with Ladakh on the Manali–Leh highway; source of Chandra, Bhaga and Yunam rivers.',clues:['Pass on Manali–Leh highway where Chandra and Bhaga rivers rise nearby']});
add('pass','Rohtang Pass',32.37,77.25,{rng:'Pir Panjal',st:'Himachal Pradesh',info:'Links Kullu valley with Lahaul–Spiti; Atal Tunnel passes beneath.',clues:['Links Kullu and Lahaul-Spiti; Beas rises nearby']});
add('pass','Kunzum La',32.40,77.63,{rng:'Spiti–Lahaul Himalaya',st:'Himachal Pradesh',info:'Links Spiti and Lahaul valleys.',clues:['Pass linking Lahaul and Spiti valleys']});
add('pass','Shipki La',31.80,78.73,{rng:'Zaskar Range',st:'Himachal Pradesh',info:'India–Tibet border pass; the Sutlej enters India here.',clues:['The Sutlej enters India through this pass in Himachal Pradesh']});
add('pass','Mana Pass',30.95,79.43,{rng:'Zaskar Range',st:'Uttarakhand',info:'Near Badrinath; India–Tibet pass, one of the highest motorable.',clues:['Pass near Badrinath on the India–Tibet border']});
add('pass','Niti Pass',30.88,79.87,{rng:'Zaskar Range',st:'Uttarakhand',info:'Chamoli district; India–Tibet pass.',clues:['India–Tibet pass in Chamoli, Uttarakhand']});
add('pass','Lipulekh Pass',30.23,81.03,{rng:'Kumaon Himalaya',st:'Uttarakhand',info:'India–Tibet–Nepal tri-junction area; used for Kailash Mansarovar Yatra.',clues:['Kailash Mansarovar Yatra route pass in Pithoragarh, Uttarakhand']});
add('pass','Nathu La',27.39,88.83,{rng:'Himalaya (Sikkim)',st:'Sikkim',info:'India–China border pass on the old Silk Route; trade pass.',clues:['Sikkim–Tibet trade pass on the Silk Route']});
add('pass','Jelep La',27.38,88.87,{rng:'Himalaya (Sikkim)',st:'Sikkim',info:'Sikkim–Tibet pass to the Chumbi valley.',clues:['Sikkim pass to the Chumbi Valley near Nathu La']});
add('pass','Bomdi La',27.25,92.40,{rng:'Eastern Himalaya',st:'Arunachal Pradesh',info:'On the Tawang route in West Kameng.',clues:['Arunachal Pradesh pass on the way to Tawang']});
add('pass','Pangsau Pass',27.23,96.18,{rng:'Patkai range',st:'Arunachal Pradesh',info:'India–Myanmar pass; the Stilwell (Ledo) Road crossed it.',clues:['Arunachal–Myanmar pass on the Ledo (Stilwell) Road']});
add('pass','Palakkad (Palghat) Gap',10.77,76.65,{rng:'Western Ghats (Nilgiri–Anamalai)',st:'Kerala–Tamil Nadu',info:'Wide gap between Nilgiri and Anamalai hills linking Kerala with Tamil Nadu.',clues:['Gap in the Western Ghats between the Nilgiris and Anamalai']});
add('pass','Thal Ghat',19.75,73.45,{rng:'Sahyadri (Western Ghats)',st:'Maharashtra',info:'Mumbai–Nashik route via Kasara.',clues:['Western Ghat pass on the Mumbai–Nashik route']});
add('pass','Bhor Ghat',18.80,73.40,{rng:'Sahyadri (Western Ghats)',st:'Maharashtra',info:'Mumbai–Pune route via Khandala.',clues:['Western Ghat pass on the Mumbai–Pune route']});
add('pass','Shencottah Gap',8.97,77.25,{rng:'Western Ghats (south)',st:'Kerala–Tamil Nadu',info:'Links Kollam (Kerala) with Tenkasi (Tamil Nadu).',clues:['Southern Western Ghats gap linking Kollam and Tenkasi']});

/* ── GLACIERS ── */
add('glacier','Siachen Glacier',35.42,77.10,{rng:'Eastern Karakoram',st:'Ladakh',info:'Source of the Nubra river; one of the longest glaciers outside the polar regions (≈76 km).',clues:['Source of the Nubra; the world’s highest battlefield']});
add('glacier','Gangotri Glacier',30.93,79.08,{rng:'Great Himalaya',st:'Uttarakhand',info:'Source of the Bhagirathi at Gaumukh; ≈30 km long.',clues:['Source of the Bhagirathi (Ganga)']});
add('glacier','Yamunotri Glacier',31.01,78.45,{rng:'Bandarpunch',st:'Uttarakhand',info:'Source of the Yamuna.',clues:['Source of the Yamuna']});
add('glacier','Satopanth Glacier',30.78,79.40,{rng:'Great Himalaya',st:'Uttarakhand',info:'Source of the Alaknanda.',clues:['Source of the Alaknanda near Badrinath']});
add('glacier','Pindari Glacier',30.25,80.00,{rng:'Kumaon Himalaya',st:'Uttarakhand',info:'Source of the Pindar river (Karnaprayag).',clues:['Kumaon glacier giving rise to the Pindar river']});
add('glacier','Milam Glacier',30.43,80.12,{rng:'Kumaon Himalaya',st:'Uttarakhand',info:'Source of the Gori Ganga; Kumaon.',clues:['Kumaon glacier feeding the Gori Ganga']});
add('glacier','Zemu Glacier',27.72,88.30,{rng:'Kangchenjunga massif',st:'Sikkim',info:'Largest glacier of the Eastern Himalaya; feeds the Teesta.',clues:['Largest glacier in the Eastern Himalaya near Kangchenjunga']});
add('glacier','Bara Shigri Glacier',32.20,77.65,{rng:'Pir Panjal / Lahaul',st:'Himachal Pradesh',info:'Largest glacier of Himachal; feeds the Chandra.',clues:['Largest glacier in Himachal Pradesh, in Lahaul']});
add('glacier','Kolahoi Glacier',34.13,75.40,{rng:'Kashmir Himalaya',st:'Jammu and Kashmir',info:'Major glacier of the Kashmir Himalaya; feeds the Lidder.',clues:['Kashmir Himalaya glacier at the foot of Kolahoi peak']});

/* ── LAKES ── */
add('lake','Wular Lake',34.37,74.55,{st:'Jammu and Kashmir',rv:'Jhelum',info:'Largest freshwater lake in India (tectonic); on the Jhelum, Bandipora.',clues:['Largest freshwater lake in India']});
add('lake','Dal Lake',34.11,74.86,{st:'Jammu and Kashmir',info:'Srinagar’s urban freshwater lake famed for houseboats and floating gardens.',clues:['Srinagar lake with shikaras and houseboats']});
add('lake','Pangong Tso',33.72,78.90,{st:'Ladakh',info:'High-altitude brackish endorheic lake shared with Tibet.',clues:['High-altitude lake straddling India and China']});
add('lake','Tso Moriri',32.90,78.30,{st:'Ladakh',info:'High-altitude lake in Changthang, Ramsar wetland.',clues:['High-altitude lake in Changthang, Ladakh, a Ramsar site']});
add('lake','Chandratal',32.48,77.62,{st:'Himachal Pradesh',info:'Crescent-shaped lake in Spiti; source of the Chandra river.',clues:['Crescent-shaped high-altitude lake in Lahaul-Spiti']});
add('lake','Sambhar Lake',26.97,75.19,{st:'Rajasthan',info:'Largest inland saline lake in India.',clues:['Largest inland saline lake in India']});
add('lake','Pushkar Lake',26.49,74.55,{st:'Rajasthan',info:'Sacred lake near Ajmer; Brahma temple.',clues:['Sacred lake near Ajmer with a Brahma temple']});
add('lake','Loktak Lake',24.52,93.80,{st:'Manipur',info:'Largest freshwater lake of NE India; phumdis; Keibul Lamjao NP is the only floating national park.',clues:['Lake with floating phumdis and the only floating national park']});
add('lake','Chilika Lake',19.72,85.32,{st:'Odisha',info:'Largest coastal lagoon of India; Asia’s largest brackish-water lagoon; Ramsar site.',clues:['Largest coastal lagoon in India; Irrawaddy dolphins']});
add('lake','Kolleru Lake',16.62,81.20,{st:'Andhra Pradesh',info:'Freshwater lake between the Godavari and Krishna deltas; Ramsar site.',clues:['Lake between the Godavari and Krishna deltas']});
add('lake','Pulicat Lake',13.60,80.20,{st:'Andhra Pradesh / Tamil Nadu',info:'Second-largest brackish lagoon of India; Sriharikota island separates it from the sea.',clues:['Lagoon separated from the sea by Sriharikota island']});
add('lake','Vembanad Lake',9.60,76.40,{st:'Kerala',info:'Longest lake in India and largest in Kerala; Ramsar; Alappuzha backwaters; Pamba empties here.',clues:['Longest lake in India, Kerala backwaters']});
add('lake','Ashtamudi Lake',8.97,76.58,{st:'Kerala',info:'Palm-shaped estuarine lake at Kollam; Ramsar site.',clues:['Kollam’s eight-armed (palm-shaped) lake']});
add('lake','Sasthamkotta Lake',9.04,76.62,{st:'Kerala',info:'Largest freshwater lake in Kerala.',clues:['Largest freshwater lake in Kerala']});
add('lake','Lonar Lake',19.98,76.51,{st:'Maharashtra',info:'Meteorite-impact crater lake in basalt (Deccan Trap).',clues:['Crater lake formed by meteorite impact in Deccan basalt']});
add('lake','Nal Sarovar',22.80,72.03,{st:'Gujarat',info:'Shallow freshwater wetland and bird sanctuary near Ahmedabad.',clues:['Gujarat wetland bird sanctuary near Ahmedabad']});
add('lake','Nainital Lake',29.39,79.45,{st:'Uttarakhand',info:'Crescent-shaped lake in Kumaon; Naini Tal.',clues:['Kumaon lake town, Naini Tal']});
add('lake','Renuka Lake',30.60,77.46,{st:'Himachal Pradesh',info:'Largest natural lake of Himachal Pradesh (Sirmaur).',clues:['Largest natural lake in Himachal Pradesh']});
add('lake','Tsomgo (Changu) Lake',27.37,88.76,{st:'Sikkim',info:'Glacial lake near Gangtok on the Nathu La road.',clues:['Glacial lake near Gangtok on the way to Nathu La']});
add('lake','Bhoj Wetland',23.24,77.37,{st:'Madhya Pradesh',info:'Bhopal’s Upper Lake; Ramsar site.',clues:['Bhopal’s Upper Lake, a Ramsar wetland']});
add('lake','Hussain Sagar',17.42,78.47,{st:'Telangana',info:'Artificial lake in Hyderabad with a Buddha statue.',clues:['Hyderabad lake with a Buddha statue']});
add('lake','Deepor Beel',26.13,91.65,{st:'Assam',info:'Ramsar wetland south-west of Guwahati.',clues:['Ramsar wetland near Guwahati']});

/* ── WATERFALLS ── */
add('fall','Kunchikal Falls',13.66,75.08,{st:'Karnataka',rv:'Varahi',info:'Highest waterfall in India (≈455 m), Shivamogga, Agumbe.',clues:['Highest waterfall in India']});
add('fall','Jog (Gersoppa) Falls',14.23,74.81,{st:'Karnataka',rv:'Sharavati',info:'≈253 m; Raja, Rani, Roarer and Rocket cascades.',clues:['Karnataka’s four-cascade waterfall on the Sharavati']});
add('fall','Nohkalikai Falls',25.27,91.69,{st:'Meghalaya',rv:'(Cherrapunji streams)',info:'Tallest plunge waterfall in India, near Cherrapunji.',clues:['Tallest plunge waterfall in India, near Cherrapunji']});
add('fall','Dudhsagar Falls',15.31,74.31,{st:'Goa',rv:'Mandovi',info:'Four-tiered fall on the Mandovi on the Goa–Karnataka border.',clues:['“Sea of Milk” waterfall on the Goa–Karnataka border']});
add('fall','Shivanasamudra Falls',12.28,77.17,{st:'Karnataka',rv:'Kaveri',info:'Twin falls Gaganachukki and Bharachukki; first hydro-electric power in Asia (1902).',clues:['Twin falls (Gaganachukki, Bharachukki) on the Kaveri']});
add('fall','Hogenakkal Falls',12.12,77.78,{st:'Tamil Nadu',rv:'Kaveri',info:'Known as the “Niagara of India” by some; Dharmapuri.',clues:['Kaveri falls and coracle rides in Tamil Nadu']});
add('fall','Athirappilly Falls',10.29,76.57,{st:'Kerala',rv:'Chalakudy',info:'Largest waterfall in Kerala.',clues:['Largest waterfall in Kerala']});
add('fall','Chitrakote Falls',19.21,81.70,{st:'Chhattisgarh',rv:'Indravati',info:'Widest waterfall in India; “Niagara of India”.',clues:['Called the Niagara of India; Bastar']});
add('fall','Dhuandhar Falls',23.13,79.80,{st:'Madhya Pradesh',rv:'Narmada',info:'At Bhedaghat near Jabalpur (Marble Rocks).',clues:['Smoke-cascade falls at Bhedaghat, Jabalpur']});
add('fall','Hundru Falls',23.45,85.60,{st:'Jharkhand',rv:'Subarnarekha',info:'≈98 m fall near Ranchi.',clues:['Ranchi’s Subarnarekha waterfall']});
add('fall','Barehipani Falls',21.65,86.37,{st:'Odisha',rv:'Budhabalanga',info:'Among India’s tallest, in Similipal.',clues:['Similipal National Park waterfall in Odisha']});
add('fall','Kapildhara Falls',22.68,81.76,{st:'Madhya Pradesh',rv:'Narmada',info:'First fall of the Narmada near Amarkantak.',clues:['Narmada’s first fall near Amarkantak']});

/* ── DAMS / BARRAGES ── */
add('dam','Bhakra Nangal Dam',31.41,76.43,{st:'Himachal Pradesh',rv:'Sutlej',info:'Gobind Sagar reservoir; one of the highest gravity dams.',clues:['Gobind Sagar reservoir']});
add('dam','Pong Dam',31.97,75.95,{st:'Himachal Pradesh',rv:'Beas',info:'Maharana Pratap Sagar reservoir.',clues:['Maharana Pratap Sagar']});
add('dam','Pandoh Dam',31.67,77.06,{st:'Himachal Pradesh',rv:'Beas',info:'Diverts Beas water to the Sutlej via the Beas–Sutlej link.',clues:['Beas–Sutlej link diversion dam']});
add('dam','Nathpa Jhakri Dam',31.55,77.97,{st:'Himachal Pradesh',rv:'Sutlej',info:'Largest hydropower station in HP.',clues:['Largest hydro project of Himachal on the Sutlej']});
add('dam','Ranjit Sagar (Thein) Dam',32.44,75.72,{st:'Punjab',rv:'Ravi',info:'Thein dam on the Ravi.',clues:['Thein dam on the Ravi']});
add('dam','Salal Dam',33.15,74.80,{st:'Jammu and Kashmir',rv:'Chenab',info:'Run-of-the-river project in Reasi; Indus Waters Treaty issues.',clues:['Reasi hydro project on the Chenab']});
add('dam','Baglihar Dam',33.28,75.34,{st:'Jammu and Kashmir',rv:'Chenab',info:'Run-of-the-river project in Ramban on the Chenab.',clues:['Ramban hydro project on the Chenab, subject of Pakistan objections']});
add('dam','Tehri Dam',30.38,78.48,{st:'Uttarakhand',rv:'Bhagirathi',info:'Highest dam in India (≈260 m); Bhagirathi–Bhilangana confluence.',clues:['Highest dam in India']});
add('dam','Farakka Barrage',24.80,87.92,{st:'West Bengal',rv:'Ganga',info:'Diverts Ganga water into the Hooghly to flush silt at Kolkata port.',clues:['Barrage built to revive the Hooghly and Kolkata port']});
add('dam','Hirakud Dam',21.52,83.87,{st:'Odisha',rv:'Mahanadi',info:'World’s longest earthen dam; first major post-independence multipurpose project.',clues:['One of the world’s longest earthen dams']});
add('dam','Rihand Dam (Govind Ballabh Pant Sagar)',24.03,83.03,{st:'Uttar Pradesh',rv:'Rihand',info:'Largest reservoir by volume in India (Pipri).',clues:['Pipri dam; Govind Ballabh Pant Sagar']});
add('dam','Maithon Dam',23.78,86.82,{st:'Jharkhand',rv:'Barakar',info:'DVC dam on the Barakar.',clues:['Damodar Valley Corporation dam on the Barakar']});
add('dam','Panchet Dam',23.67,86.74,{st:'Jharkhand',rv:'Damodar',info:'DVC dam on the Damodar.',clues:['DVC dam on the Damodar near Dhanbad']});
add('dam','Gandhi Sagar Dam',24.70,75.55,{st:'Madhya Pradesh',rv:'Chambal',info:'First of the Chambal valley dams.',clues:['First dam on the Chambal']});
add('dam','Kota Barrage',25.18,75.86,{st:'Rajasthan',rv:'Chambal',info:'Irrigation barrage at Kota.',clues:['Barrage at Kota on the Chambal']});
add('dam','Indira Sagar Dam',22.28,76.47,{st:'Madhya Pradesh',rv:'Narmada',info:'Punasa; largest reservoir by capacity in MP.',clues:['Punasa dam on the Narmada']});
add('dam','Sardar Sarovar Dam',21.83,73.75,{st:'Gujarat',rv:'Narmada',info:'Kevadia; Statue of Unity nearby; one of the largest concrete gravity dams.',clues:['Kevadia dam near the Statue of Unity']});
add('dam','Ukai Dam',21.25,73.59,{st:'Gujarat',rv:'Tapi',info:'Vallabh Sagar reservoir near Surat.',clues:['Gujarat dam on the Tapi forming Vallabh Sagar']});
add('dam','Kadana Dam',23.32,73.82,{st:'Gujarat',rv:'Mahi',info:'Mahi river, Panchmahal.',clues:['Gujarat dam on the Mahi']});
add('dam','Mahi Bajaj Sagar Dam',23.55,74.40,{st:'Rajasthan',rv:'Mahi',info:'Banswara, Rajasthan.',clues:['Banswara dam on the Mahi']});
add('dam','Dharoi Dam',24.00,72.85,{st:'Gujarat',rv:'Sabarmati',info:'On the Sabarmati.',clues:['Main dam on the Sabarmati']});
add('dam','Jayakwadi Dam',19.49,75.38,{st:'Maharashtra',rv:'Godavari',info:'Paithan; largest earthen dam in Maharashtra.',clues:['Paithan dam on the Godavari']});
add('dam','Sriramsagar (Pochampad) Dam',18.97,78.34,{st:'Telangana',rv:'Godavari',info:'Pochampad project on the Godavari.',clues:['Pochampad project on the Godavari']});
add('dam','Polavaram Project',17.25,81.65,{st:'Andhra Pradesh',rv:'Godavari',info:'National project on the Godavari.',clues:['National project on the Godavari near Papikondalu']});
add('dam','Koyna Dam',17.40,73.75,{st:'Maharashtra',rv:'Koyna',info:'Largest hydro plant in Maharashtra; Koyna earthquake of 1967.',clues:['Reservoir-induced earthquake 1967; Koyna river']});
add('dam','Almatti Dam',16.33,75.88,{st:'Karnataka',rv:'Krishna',info:'Lal Bahadur Shastri Sagar.',clues:['Lal Bahadur Shastri Sagar on the Krishna']});
add('dam','Narayanpur Dam',16.17,76.37,{st:'Karnataka',rv:'Krishna',info:'Basavasagar reservoir.',clues:['Basavasagar reservoir on the Krishna']});
add('dam','Srisailam Dam',16.09,78.90,{st:'Andhra Pradesh',rv:'Krishna',info:'In the Nallamala hills; Mallikarjuna Jyotirlinga.',clues:['Dam in the Nallamala hills near a Jyotirlinga shrine']});
add('dam','Nagarjuna Sagar Dam',16.57,79.31,{st:'Telangana / Andhra Pradesh',rv:'Krishna',info:'One of the world’s largest masonry dams.',clues:['World’s largest masonry dam on the Krishna']});
add('dam','Prakasam Barrage',16.51,80.60,{st:'Andhra Pradesh',rv:'Krishna',info:'At Vijayawada.',clues:['Vijayawada barrage']});
add('dam','Tungabhadra Dam',15.27,76.33,{st:'Karnataka',rv:'Tungabhadra',info:'Hosapete (Pampa Sagar).',clues:['Hosapete dam, near Hampi']});
add('dam','Krishnaraja Sagara (KRS) Dam',12.43,76.57,{st:'Karnataka',rv:'Kaveri',info:'Near Mysuru; Brindavan Gardens.',clues:['Brindavan Gardens dam near Mysuru']});
add('dam','Mettur Dam',11.80,77.80,{st:'Tamil Nadu',rv:'Kaveri',info:'Stanley Reservoir.',clues:['Stanley Reservoir']});
add('dam','Kallanai (Grand Anicut)',10.83,78.82,{st:'Tamil Nadu',rv:'Kaveri',info:'One of the world’s oldest functioning dams (Chola era).',clues:['Ancient Chola dam near Tiruchirappalli']});
add('dam','Somasila Dam',14.50,79.30,{st:'Andhra Pradesh',rv:'Pennar',info:'Near Nellore.',clues:['Nellore-district dam on the Pennar']});
add('dam','Idukki Dam',9.84,76.97,{st:'Kerala',rv:'Periyar',info:'Arch dam in Kerala.',clues:['Kerala’s tall arch dam']});
add('dam','Mullaperiyar Dam',9.53,77.14,{st:'Kerala',rv:'Periyar',info:'Operated by Tamil Nadu; long-standing dispute.',clues:['Century-old dam in Kerala operated by Tamil Nadu']});
add('dam','Linganamakki Dam',14.18,74.84,{st:'Karnataka',rv:'Sharavati',info:'Sharavathi project reservoir.',clues:['Sharavathi reservoir above Jog Falls']});

/* ── CITIES ON RIVERS ── */
add('city','Srinagar',34.08,74.80,{rv:'Jhelum',st:'Jammu and Kashmir'});
add('city','Leh',34.17,77.58,{rv:'Indus',st:'Ladakh'});
add('city','Chamba',32.55,76.13,{rv:'Ravi',st:'Himachal Pradesh'});
add('city','Kullu',31.96,77.11,{rv:'Beas',st:'Himachal Pradesh'});
add('city','Rupnagar (Ropar)',30.97,76.53,{rv:'Sutlej',st:'Punjab'});
add('city','Rishikesh',30.09,78.27,{rv:'Ganga',st:'Uttarakhand'});
add('city','Haridwar',29.95,78.16,{rv:'Ganga',st:'Uttarakhand'});
add('city','Kanpur',26.45,80.35,{rv:'Ganga',st:'Uttar Pradesh'});
add('city','Prayagraj',25.43,81.85,{rv:'Ganga',st:'Uttar Pradesh',info:'Triveni Sangam: Ganga + Yamuna (+ mythical Saraswati).'});
add('city','Varanasi',25.32,83.01,{rv:'Ganga',st:'Uttar Pradesh'});
add('city','Patna',25.61,85.14,{rv:'Ganga',st:'Bihar'});
add('city','Bhagalpur',25.24,86.97,{rv:'Ganga',st:'Bihar'});
add('city','Delhi',28.65,77.23,{rv:'Yamuna',st:'Delhi'});
add('city','Mathura',27.49,77.67,{rv:'Yamuna',st:'Uttar Pradesh'});
add('city','Agra',27.18,78.02,{rv:'Yamuna',st:'Uttar Pradesh'});
add('city','Lucknow',26.85,80.95,{rv:'Gomti',st:'Uttar Pradesh'});
add('city','Ayodhya',26.80,82.20,{rv:'Ghaghara',st:'Uttar Pradesh'});
add('city','Bareilly',28.37,79.43,{rv:'Ramganga',st:'Uttar Pradesh'});
add('city','Kota',25.18,75.84,{rv:'Chambal',st:'Rajasthan'});
add('city','Orchha',25.35,78.64,{rv:'Betwa',st:'Madhya Pradesh'});
add('city','Ujjain',23.18,75.78,{rv:'Shipra',st:'Madhya Pradesh'});
add('city','Kolkata',22.57,88.36,{rv:'Hooghly',st:'West Bengal'});
add('city','Siliguri',26.72,88.43,{rv:'Mahananda',st:'West Bengal'});
add('city','Guwahati',26.18,91.74,{rv:'Brahmaputra',st:'Assam'});
add('city','Dibrugarh',27.48,94.91,{rv:'Brahmaputra',st:'Assam'});
add('city','Tezpur',26.63,92.80,{rv:'Brahmaputra',st:'Assam'});
add('city','Silchar',24.83,92.78,{rv:'Barak',st:'Assam'});
add('city','Cuttack',20.46,85.88,{rv:'Mahanadi',st:'Odisha'});
add('city','Sambalpur',21.47,83.97,{rv:'Mahanadi',st:'Odisha'});
add('city','Jamshedpur',22.80,86.20,{rv:'Subarnarekha',st:'Jharkhand'});
add('city','Rourkela',22.26,84.85,{rv:'Brahmani',st:'Odisha'});
add('city','Nashik',20.00,73.79,{rv:'Godavari',st:'Maharashtra'});
add('city','Nanded',19.15,77.32,{rv:'Godavari',st:'Maharashtra'});
add('city','Rajahmundry',17.00,81.78,{rv:'Godavari',st:'Andhra Pradesh'});
add('city','Bhadrachalam',17.67,80.89,{rv:'Godavari',st:'Telangana'});
add('city','Pandharpur',17.67,75.33,{rv:'Bhima',st:'Maharashtra'});
add('city','Vijayawada',16.51,80.62,{rv:'Krishna',st:'Andhra Pradesh'});
add('city','Sangli',16.85,74.57,{rv:'Krishna',st:'Maharashtra'});
add('city','Kurnool',15.83,78.04,{rv:'Tungabhadra',st:'Andhra Pradesh'});
add('city','Hampi',15.34,76.46,{rv:'Tungabhadra',st:'Karnataka'});
add('city','Srirangapatna',12.42,76.69,{rv:'Kaveri',st:'Karnataka'});
add('city','Tiruchirappalli',10.80,78.69,{rv:'Kaveri',st:'Tamil Nadu'});
add('city','Thanjavur',10.79,79.14,{rv:'Kaveri',st:'Tamil Nadu'});
add('city','Nellore',14.44,79.99,{rv:'Pennar',st:'Andhra Pradesh'});
add('city','Madurai',9.92,78.12,{rv:'Vaigai',st:'Tamil Nadu'});
add('city','Tirunelveli',8.73,77.70,{rv:'Tamiraparani',st:'Tamil Nadu'});
add('city','Jabalpur',23.18,79.95,{rv:'Narmada',st:'Madhya Pradesh'});
add('city','Bharuch',21.71,72.99,{rv:'Narmada',st:'Gujarat'});
add('city','Surat',21.17,72.83,{rv:'Tapi',st:'Gujarat'});
add('city','Ahmedabad',23.03,72.58,{rv:'Sabarmati',st:'Gujarat'});
add('city','Banswara',23.55,74.44,{rv:'Mahi',st:'Rajasthan'});
add('city','Aluva',10.11,76.35,{rv:'Periyar',st:'Kerala'});
add('city','Panaji',15.50,73.83,{rv:'Mandovi',st:'Goa'});
add('city','Hyderabad',17.38,78.48,{rv:'Musi',st:'Telangana'});
add('city','Pune',18.52,73.86,{rv:'Mula–Mutha',st:'Maharashtra'});
add('city','Mangaluru',12.87,74.84,{rv:'Netravati–Gurupura',st:'Karnataka'});

/* ── ISLANDS ── */
add('island','Barren Island',12.28,93.86,{st:'Andaman Sea',info:'The only confirmed active volcano in India.',clues:['Only active volcano in India']});
add('island','Narcondam Island',13.43,94.27,{st:'Andaman Sea',info:'Dormant volcano; Narcondam hornbill is endemic.',clues:['Dormant volcanic island with an endemic hornbill']});
add('island','Port Blair (South Andaman)',11.67,92.74,{st:'Andaman and Nicobar',info:'Capital of the UT; Cellular Jail.',clues:['Capital of Andaman & Nicobar Islands']});
add('island','Great Nicobar',7.03,93.85,{st:'Andaman and Nicobar',info:'Largest of the Nicobar islands; Mt Thullier is its highest peak.',clues:['Largest island of the Nicobar group']});
add('island','Indira Point',6.75,93.83,{st:'Andaman and Nicobar',info:'Southernmost point of India (Great Nicobar).',clues:['Southernmost point of India']});
add('island','Car Nicobar',9.17,92.78,{st:'Andaman and Nicobar',info:'Northernmost of the Nicobar group; 10° Channel lies north of it.',clues:['Northernmost large island of the Nicobars']});
add('island','Little Andaman',10.70,92.55,{st:'Andaman and Nicobar',info:'Southernmost of the Andaman group, separated by Duncan Passage from South Andaman.',clues:['Southernmost island of the Andaman group']});
add('island','Kavaratti',10.57,72.64,{st:'Lakshadweep',info:'Capital of Lakshadweep.',clues:['Capital of Lakshadweep']});
add('island','Minicoy',8.28,73.04,{st:'Lakshadweep',info:'Southernmost atoll of Lakshadweep; Nine Degree Channel to its north, Eight Degree Channel to its south.',clues:['Southernmost island of Lakshadweep']});
add('island','Majuli',26.95,94.20,{st:'Assam',info:'Largest river island in the world, in the Brahmaputra.',clues:['World’s largest river island']});
add('island','Pamban Island',9.28,79.20,{st:'Tamil Nadu',info:'Island of Rameswaram; Pamban bridge links it to the mainland.',clues:['Rameswaram island linked by the Pamban Bridge']});
add('island','Sriharikota',13.72,80.23,{st:'Andhra Pradesh',info:'Barrier island separating Pulicat Lake from the sea; ISRO launch site.',clues:['ISRO’s launch site, barrier island of Pulicat']});
add('island','Sagar Island',21.65,88.08,{st:'West Bengal',info:'Island at the mouth of the Hooghly; Gangasagar fair.',clues:['Hooghly mouth island with Gangasagar Mela']});
add('island','Elephanta Island',18.96,72.93,{st:'Maharashtra',info:'Island in Mumbai harbour; rock-cut caves.',clues:['Mumbai harbour island with rock-cut cave temples']});

/* ── COASTAL FEATURES ── */
add('coast','Palk Strait',9.90,79.40,{st:'Between India and Sri Lanka',info:'Separates Tamil Nadu from Sri Lanka; Adam’s Bridge (Ram Setu) lies at its southern end.',clues:['Strait between Tamil Nadu and Sri Lanka']});
add('coast','Gulf of Mannar',8.60,78.90,{st:'Between India and Sri Lanka',info:'South of Palk Strait; Gulf of Mannar Biosphere Reserve, pearl banks.',clues:['Marine biosphere reserve with coral islands off Tamil Nadu']});
add('coast','Gulf of Khambhat',21.80,72.35,{st:'Gujarat',info:'Gulf into which the Narmada, Tapi, Mahi and Sabarmati drain.',clues:['Gulf receiving the Narmada, Tapi, Mahi and Sabarmati']});
add('coast','Gulf of Kachchh',22.60,69.80,{st:'Gujarat',info:'Gulf on the west of Gujarat; Marine National Park.',clues:['Gujarat gulf with a Marine National Park near Jamnagar']});
add('coast','Rann of Kachchh',23.90,70.00,{st:'Gujarat',info:'Seasonal salt marsh; Great and Little Rann; Wild Ass Sanctuary.',clues:['Seasonal salt marsh in Gujarat, Wild Ass Sanctuary']});
add('coast','Sundarbans',21.95,89.00,{st:'West Bengal',info:'World’s largest delta and mangrove forest (Ganga–Brahmaputra); Royal Bengal tiger.',clues:['Largest delta and mangrove forest in the world']});
add('coast','Cape Comorin (Kanyakumari)',8.08,77.55,{st:'Tamil Nadu',info:'Southern tip of mainland India; Bay of Bengal, Arabian Sea and Indian Ocean meet.',clues:['Southern tip of mainland India']});
add('coast','Ten Degree Channel',10.00,92.60,{st:'Andaman and Nicobar',info:'Separates the Andaman and Nicobar islands (Little Andaman and Car Nicobar).',clues:['Channel between Andaman and Nicobar groups']});
add('coast','Duncan Passage',11.10,92.40,{st:'Andaman and Nicobar',info:'Between South Andaman and Little Andaman.',clues:['Passage between South and Little Andaman']});
add('coast','Sir Creek',23.97,68.12,{st:'Gujarat–Pakistan border',info:'Tidal estuary in the Rann of Kachchh; boundary dispute with Pakistan.',clues:['Disputed estuary in the Rann of Kachchh']});

window.PLACES=P;
})();
