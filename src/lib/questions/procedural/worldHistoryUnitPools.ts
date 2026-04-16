import { item, type WhQuestionGen } from "./worldHistoryCore";
import {
 WH_U1_DYNAMIC,
 WH_U2_DYNAMIC,
 WH_U3_DYNAMIC,
 WH_U4_DYNAMIC,
 WH_U5_DYNAMIC,
 WH_U6_DYNAMIC,
 WH_U7_DYNAMIC,
 WH_U8_DYNAMIC,
 WH_U9_DYNAMIC,
} from "./worldHistoryDynamicPools";

/* - - - Unit 1: The Global Tapestry (c. 1200) - - - */

const WH_U1: WhQuestionGen[] = [
 item(
 "u1-postclass",
 "A major theme of the post-classical period around 1200 CE is the growth of",
 "long-distance trade and cultural exchange",
 ["isolation of every world region", "universal democracy", "abolition of all religions"],
 "Silk Roads, Indian Ocean networks, and trans-Saharan routes linked societies.",
 ),
 item(
 "u1-thera",
 "Theravada Buddhism is most closely associated with",
 "meditation, textual conservatism, and monastic discipline",
 ["massive imperial courts in Baghdad", "the Protestant Reformation", "the Council of Trent"],
 "Theravada ('way of the elders') stresses monastic practice and early texts.",
 ),
 item(
 "u1-maha",
 "Mahayana Buddhism spread widely in part because it",
 "offered bodhisattvas and devotional practices accessible to many laypeople",
 ["rejected all ritual", "forbade translation of texts", "denied ethical teachings"],
 "Mahayana emphasized compassion and salvation-like goals for broader audiences.",
 ),
 item(
 "u1-conf",
 "Confucius's teachings collected in the Analects focus especially on",
 "social harmony, proper relationships, and ethical leadership",
 ["mystical union with a single creator", "five pillars of prayer", "monastic withdrawal only"],
 "Confucianism centers on order, education, and reciprocal duties.",
 ),
 item(
 "u1-hind",
 "In Hindu thought, following one's dharma is meant to advance the soul toward",
 "moksha (liberation)",
 ["the Pax Mongolica", "indulgence sales", "a communist state"],
 "Dharma (duty) and eventual moksha are central goals alongside samsara.",
 ),
 item(
 "u1-islam",
 "The Five Pillars of Islam include prayer, charity, fasting, pilgrimage, and",
 "the declaration of faith (shahada)",
 ["the Edict of Nantes", "the Berlin Conference", "the Treaty of Versailles"],
 "The shahada professes faith in one God and Muhammad's message.",
 ),
 item(
 "u1-sunni-shia",
 "The Sunni-Shia split in Islam arose chiefly from disagreement over",
 "rightful leadership after Muhammad",
 ["whether to use Latin in worship", "the date of the Battle of Stalingrad", "Protestant reforms"],
 "Succession to political-religious authority divided the community early on.",
 ),
 item(
 "u1-abbasid",
 "The Abbasid caliphate (750-1258) is especially remembered for",
 "Baghdad as a hub of trade, scholarship, and the House of Wisdom",
 ["abolishing Islam in Iberia", "founding the Hanseatic League", "inventing the steam engine"],
 "Abbasid-era Baghdad fostered translation, science, and commerce.",
 ),
 item(
 "u1-feud",
 "In European feudalism, land granted by a lord to a lesser noble in exchange for service was often called a",
 "fief",
 ["mandate of heaven", "sphere of influence", "encomienda grant only"],
 "Fiefs structured obligation and localized political-military ties.",
 ),
 item(
 "u1-song",
 "Neo-Confucianism in Song China blended Confucian ethics with ideas from",
 "Buddhism and Daoism",
 ["the Protestant Reformation", "the Congress of Vienna", "the Napoleonic Code only"],
 "Neo-Confucian thinkers integrated metaphysical concerns with social ethics.",
 ),
 item(
 "u1-japan",
 "In feudal Japan, the military leader who often held real power beneath the emperor was the",
 "shogun",
 ["daimyo exclusively as emperor", "pharaoh", "caesaropapist patriarch"],
 "Emperors remained symbolic while shoguns led warrior government.",
 ),
 item(
 "u1-khmer",
 "The Khmer Empire is associated with monumental architecture such as",
 "Angkor Wat",
 ["the Hagia Sophia", "the Parthenon", "the Palace of Versailles"],
 "Khmer rulers patronized Hindu-Buddhist temple complexes in Southeast Asia.",
 ),
 item(
 "u1-aztec",
 "The Aztec capital Tenochtitlan was built on",
 "islands and causeways in Lake Texcoco",
 ["the Andean altiplano only", "the Ganges delta", "the Baltic coast"],
 "Tenochtitlan's urban design reflected Mesoamerican engineering and tribute systems.",
 ),
];

/* - - - Unit 2: Networks of Exchange - - - */

const WH_U2: WhQuestionGen[] = [
 item(
 "u2-hanse",
 "The Hanseatic League is best described as",
 "a northern European trading network of allied towns",
 ["a Mongol military horde", "a Chinese naval treasure fleet", "a Catholic monastic order"],
 "Hanse cities cooperated for commerce and mutual protection.",
 ),
 item(
 "u2-silk",
 "Cities such as Samarkand and Kashgar were important because they",
 "linked East and West along Silk Road trade routes",
 ["were capitals of the Aztec Empire", "hosted the Congress of Vienna", "ended the slave trade"],
 "Silk Road oases were nodes of goods, faiths, and ideas.",
 ),
 item(
 "u2-plague",
 "The bubonic plague pandemic of the 14th century spread rapidly partly because of",
 "merchant traffic along trade routes",
 ["universal vaccination", "the abolition of serfdom everywhere", "isolation of Japan only"],
 "Y. pestis moved with ships, caravans, and wartime movement.",
 ),
 item(
 "u2-mongol",
 "The Mongol Empire's impact on Afro-Eurasia included",
 "safer passage for some merchants and wider cultural diffusion",
 ["ending all trade", "destroying paper money globally", "unifying world religion"],
 "Pax Mongolica facilitated movement even amid brutal conquests.",
 ),
 item(
 "u2-mali",
 "Mansa Musa's famous pilgrimage highlighted",
 "Mali's wealth and ties to trans-Saharan and Islamic networks",
 ["Russian serfdom", "the Treaty of Tordesillas", "the Berlin Conference"],
 "Mali controlled key gold-salt trade corridors and showcased Islamic prestige.",
 ),
 item(
 "u2-io",
 "Indian Ocean trade c. 1200-1450 relied heavily on",
 "monsoon winds and maritime expertise of diverse merchants",
 ["the Erie Canal", "railroads across Siberia", "steamships only"],
 "Seasonal monsoons structured voyages between ports from East Africa to China.",
 ),
 item(
 "u2-travel",
 "Ibn Battuta is noted for",
 "extensive travel across the Islamic world and beyond",
 ["founding the Mughal Empire", "leading the Haitian Revolution", "drafting the Magna Carta"],
 "His rihla illustrates interconnected Dar al-Islam societies.",
 ),
 item(
 "u2-crus",
 "A major effect of the Crusades was",
 "increased contact (and conflict) between Latin Christendom and the Islamic world",
 ["ending feudalism immediately", "founding the United Nations", "abolishing Christianity in Europe"],
 "Crusading intensified cultural exchange alongside violence.",
 ),
 item(
 "u2-schol",
 "Medieval scholasticism often sought to",
 "reconcile faith with classical philosophy using reason",
 ["reject all Greek learning", "ban universities", "end the use of Latin"],
 "Figures like Aquinas engaged Aristotle within Christian theology.",
 ),
 item(
 "u2-urban",
 "Growing trade in medieval Europe contributed to",
 "town charters and merchant political influence",
 ["complete rural self-sufficiency", "the end of coinage", "zero urban growth"],
 "Burghers and guilds reshaped local power alongside nobles.",
 ),
];

/* - - - Unit 3: Land-Based Empires - - - */

const WH_U3: WhQuestionGen[] = [
 item(
 "u3-print",
 "Johannes Gutenberg's printing press (mid-1400s) most directly accelerated",
 "the spread of ideas and literacy in Europe",
 ["the end of all wars", "Chinese isolation", "abolition of feudalism overnight"],
 "Cheaper books fueled Reformation debates and scientific communication.",
 ),
 item(
 "u3-luther",
 "Martin Luther's criticisms of indulgences helped spark",
 "the Protestant Reformation",
 ["the Meiji Restoration", "the Haitian Revolution", "the Russian serf emancipation"],
 "Reformation splintered Latin Christian unity in Western/Central Europe.",
 ),
 item(
 "u3-otto",
 "The Ottoman devshirme system supplied the state with",
 "Christian boys trained as Janissaries and administrators",
 ["Mongol tribute girls", "African slaves for Caribbean plantations", "French Huguenot pastors"],
 "Devshirme centralized elite loyalty to the sultan.",
 ),
 item(
 "u3-mughal",
 "Akbar's policies toward subjects of different faiths often emphasized",
 "toleration and administrative integration",
 ["forced conversion of all Hindus", "abolishing Persian at court", "closing all trade"],
 "Mughal success drew on flexible rule and elite cooperation.",
 ),
 item(
 "u3-qing",
 "The Qing dynasty's legitimacy strategies included presenting rulers as",
 "patrons of Confucian order while ruling a multiethnic empire",
 ["abolishing the civil service exams", "rejecting all prior Chinese institutions", "moving the capital to India"],
 "Qing emperors blended Manchu military power with Han bureaucratic traditions.",
 ),
 item(
 "u3-toku",
 "The Tokugawa shogunate's sakoku policies aimed to",
 "limit foreign influence and control trade/contact",
 ["colonize Latin America", "conquer the Ottoman Empire", "abolish Shinto"],
 "Seclusion was enforced unevenly but shaped early modern Japan.",
 ),
 item(
 "u3-sci",
 "The Scientific Revolution challenged older models by stressing",
 "empirical observation, mathematics, and testable explanations",
 ["only church councils as authority", "abolition of universities", "rejecting measurement"],
 "Heliocentrism and new physics slowly shifted European cosmology.",
 ),
 item(
 "u3-france",
 "Louis XIV's centralized rule in France featured",
 "a powerful bureaucracy and palace-centered absolutism",
 ["complete democracy", "abolition of Catholicism", "immediate German unification"],
 "Versailles symbolized royal prestige and noble control.",
 ),
 item(
 "u3-russia",
 "Peter the Great's reforms often aimed to",
 "modernize military and administration along European models",
 ["end Orthodox Christianity", "move the capital to Paris", "abolish serfdom entirely"],
 "Westernizing elites and armies was central to Romanov state-building.",
 ),
 item(
 "u3-spain",
 "Habsburg Spain's power rested heavily on",
 "American silver flows and composite monarchy structures",
 ["exclusive control of Indian Ocean trade", "abolishing Christianity", "the Industrial Revolution"],
 "Bullion financed wars but also fueled inflation and debt.",
 ),
];

/* - - - Unit 4: Transoceanic Interconnections - - - */

const WH_U4: WhQuestionGen[] = [
 item(
 "u4-tord",
 "The Treaty of Tordesillas (1494) primarily",
 "divided spheres of Iberian exploration between Spain and Portugal",
 ["ended the Thirty Years' War", "created NATO", "partitioned Africa in 1884"],
 "Papal arbitration shaped early Atlantic colonial claims.",
 ),
 item(
 "u4-columb",
 "The Columbian Exchange refers to the transfer of",
 "plants, animals, diseases, and peoples across the Atlantic",
 ["only gold", "only Protestant settlers", "only printed books eastward"],
 "Maize, potatoes, horses, and smallpox reshaped societies.",
 ),
 item(
 "u4-encom",
 "The encomienda system in Spanish America granted colonists",
 "labor/tribute access from indigenous communities (often coercive)",
 ["universal citizenship", "abolition of slavery", "total indigenous self-rule"],
 "It extracted labor while justifying Spanish authority.",
 ),
 item(
 "u4-middle",
 "The Middle Passage describes",
 "the brutal Atlantic shipment of enslaved Africans",
 ["pilgrimages to Mecca", "Silk Road caravans", "Mongol horse relays"],
 "Mortality and resistance marked this coerced migration.",
 ),
 item(
 "u4-merc",
 "Mercantilist theory encouraged states to",
 "build favorable balances of trade and colonial monopolies",
 ["abolish tariffs entirely", "ignore navies", "reject bullion"],
 "Colonies supplied raw materials and captive markets for metropoles.",
 ),
 item(
 "u4-joint",
 "Joint-stock companies like the VOC/British East India Company",
 "pooled capital to finance risky long-distance trade and conquest",
 ["were medieval guilds only", "banned overseas voyages", "abolished private property"],
 "They linked investors to imperial expansion.",
 ),
 item(
 "u4-smallpox",
 "Old World diseases such as smallpox in the Americas",
 "devastated populations lacking immunity, aiding conquest",
 ["had no demographic effect", "only harmed Europeans", "stopped all colonization"],
 "Disease was a demographic weapon alongside violence.",
 ),
 item(
 "u4-silver",
 "Much American silver ended up financing trade with",
 "Ming/Qing China through Pacific and global networks",
 ["isolated Australian societies only", "the Hanseatic League exclusively", "abolition societies"],
 "Silver linked American mines to Asian consumer economies.",
 ),
 item(
 "u4-tech",
 "Oceanic exploration after 1450 depended on technologies such as",
 "caravels, improved sails, compasses, and astrolabes",
 ["steam locomotives", "telegraphs", "nuclear reactors"],
 "Iberian navigation built on prior Mediterranean and Islamic knowledge.",
 ),
 item(
 "u4-zheng",
 "Ming China's early 15th-century voyages led by Zheng He are noted for",
 "showing state capacity for Indian Ocean diplomacy and display",
 ["permanent colonization of Australia", "ending Confucian exams", "founding the Mughal Empire"],
 "Later policy retrenched maritime outreach.",
 ),
];

/* - - - Unit 5: Revolutions - - - */

const WH_U5: WhQuestionGen[] = [
 item(
 "u5-locke",
 "John Locke's political thought emphasized",
 "natural rights and the legitimacy of government protecting life, liberty, and property",
 ["divine right without limits", "absolute Hobbesian terror", "the abolition of law"],
 "Locke influenced later Atlantic revolutions.",
 ),
 item(
 "u5-fr",
 "The French Revolution began amid",
 "fiscal crisis, estate inequality, and political deadlock",
 ["successful containment of all ideas", "instant women's suffrage", "peace with no reform"],
 "Third Estate mobilization and violence transformed France.",
 ),
 item(
 "u5-haiti",
 "The Haitian Revolution's significance includes",
 "a successful slave-led independence in an Atlantic plantation colony",
 ["restoring Bourbon absolutism", "founding the Ottoman Empire", "uniting Italy"],
 "It challenged racial slavery's legitimacy globally.",
 ),
 item(
 "u5-bolivar",
 "Simon Bolivar is most associated with",
 "independence movements against Spanish rule in northern South America",
 ["the Meiji Restoration", "the Russian serf decree", "the Berlin Conference"],
 "Creole elites and popular armies reshaped Latin America.",
 ),
 item(
 "u5-indus",
 "Industrialization in Britain first took off in sectors such as",
 "textiles using new machines and factory organization",
 ["computer chips", "nuclear power", "mass automobile assembly lines in 1700"],
 "Cotton spinning and weaving led early mechanization.",
 ),
 item(
 "u5-marx",
 "Karl Marx's critique centered on",
 "class struggle and exploitation under capitalist relations of production",
 ["divine-right monarchy", "mercantilist bullion only", "abolishing all technology"],
 "Marxism inspired socialist and labor movements worldwide.",
 ),
 item(
 "u5-nat",
 "19th-century nationalism often sought",
 "cultural unity and independent nation-states",
 ["abolishing all borders instantly", "ending literacy", "rejecting any shared language"],
 "Italy and Germany exemplify unification drives.",
 ),
 item(
 "u5-women",
 "Mary Wollstonecraft and later feminists argued for",
 "expanded education and rights for women",
 ["strict gender exclusion from public life", "abolition of marriage universally", "ending science"],
 "Women's rights debates accompanied revolutionary-era claims of equality.",
 ),
 item(
 "u5-rev",
 "The Atlantic revolutions shared themes of",
 "popular sovereignty challenging old hierarchies",
 ["preserving serfdom everywhere", "rejecting any constitutions", "ending all trade"],
 "Ideas of citizenship spread unevenly but widely.",
 ),
 item(
 "u5-ludd",
 "Luddite protests targeted",
 "machinery threatening artisan livelihoods in early industrial Britain",
 ["university endowments", "the Catholic Church only", "Russian serfdom exclusively"],
 "They reflected labor's fear of deskilling and displacement.",
 ),
];

/* - - - Unit 6: Consequences of Industrialization - - - */

const WH_U6: WhQuestionGen[] = [
 item(
 "u6-imperial",
 "European imperialism in the late 19th century was justified by ideologies such as",
 "'civilizing missions' and social Darwinist rhetoric",
 ["purely humanitarian aid with no extraction", "abolition of all colonies in 1850", "worker-owned factories globally"],
 "Racist pseudoscience mingled with economic motives.",
 ),
 item(
 "u6-india",
 "British rule after the 1857 uprising intensified through measures such as",
 "direct Crown rule and tighter imperial administration",
 ["immediate Indian independence", "abolishing English education", "ending all railways"],
 "The Raj integrated India into global imperial circuits.",
 ),
 item(
 "u6-china",
 "Unequal treaties in 19th-century China often forced",
 "open ports, extraterritoriality, and indemnities",
 ["complete Qing industrial dominance", "abolition of all foreign trade", "immediate democracy"],
 "Western and Japanese pressure eroded Qing sovereignty.",
 ),
 item(
 "u6-berlin",
 "The Berlin Conference (1884-85) is associated with",
 "European powers negotiating African territorial claims",
 ["ending World War I", "founding the UN", "abolishing slavery globally"],
 "It accelerated formal partition without African consent.",
 ),
 item(
 "u6-meiji",
 "The Meiji Restoration promoted",
 "state-led industrialization and military modernization",
 ["permanent sakoku isolation", "abolishing all Shinto shrines", "rejecting railroads"],
 "Japan became an imperial competitor by the early 20th century.",
 ),
 item(
 "u6-africa",
 "Colonial borders in Africa often",
 "split ethnic groups and ignored prior political arrangements",
 ["perfectly matched indigenous states", "were drawn only by Africans in 1884", "avoided all conflict"],
 "Arbitrary lines fueled later instability.",
 ),
 item(
 "u6-labor",
 "Factory reform movements in industrial Europe pushed for",
 "limits on child labor, hours, and unsafe conditions",
 ["abolishing all unions", "zero regulation", "banning women from wages forever"],
 "State intervention slowly responded to worker mobilization.",
 ),
 item(
 "u6-opium",
 "The Opium Wars resulted partly because",
 "British traders pushed opium into China against imperial prohibitions",
 ["China exported industrial goods to Britain", "Japan invaded Manchuria in 1931", "the US bought Alaska"],
 "Coercion opened China to expanded foreign penetration.",
 ),
 item(
 "u6-suez",
 "The Suez Canal (1869) mattered because it",
 "shortened Europe-Indian Ocean routes and boosted strategic rivalry",
 ["blocked all Red Sea trade", "was irrelevant to empire", "ended the slave trade instantly"],
 "Canals reshaped global shipping and finance.",
 ),
 item(
 "u6-env",
 "Industrial extraction in colonies often",
 "prioritized export commodities and infrastructure for extraction",
 ["balanced local welfare first in every case", "avoided environmental harm", "ended monoculture"],
 "Rubber, minerals, and cash crops structured dependency.",
 ),
];

/* - - - Unit 7: Global Conflict - - - */

const WH_U7: WhQuestionGen[] = [
 item(
 "u7-sarajevo",
 "World War I's immediate trigger included",
 "the assassination of Archduke Franz Ferdinand in Sarajevo",
 ["the storming of the Bastille", "the Russian Revolution only", "Pearl Harbor"],
 "Alliance systems escalated a Balkan crisis into general war.",
 ),
 item(
 "u7-treaty",
 "The Treaty of Versailles (1919) imposed on Germany",
 "reparations, territorial losses, and military restrictions",
 ["unlimited army growth", "annexation of Russia", "a permanent US mandate over Britain"],
 "Harsh terms fed resentment in Weimar Germany.",
 ),
 item(
 "u7-league",
 "The League of Nations",
 "aimed at collective security but lacked US membership and had limited enforcement",
 ["prevented World War II entirely", "abolished all empires", "created the EU"],
 "Weak institutions struggled against great-power rivalry.",
 ),
 item(
 "u7-rusrev",
 "The Bolsheviks under Lenin promised",
 "'Peace, Land, and Bread' to win support in 1917",
 ["continuation of total war indefinitely", "restoration of the tsar", "abolition of all factories"],
 "Soviet power emerged from war-weariness and land hunger.",
 ),
 item(
 "u7-gd",
 "The Great Depression spread globally partly through",
 "financial linkages, debt, and collapsing trade",
 ["universal prosperity", "the end of tariffs", "isolation having no effects"],
 "Bank failures and protectionism deepened the slump.",
 ),
 item(
 "u7-fasc",
 "Fascist movements typically glorified",
 "nation/race, authoritarian leadership, and violent renewal",
 ["liberal pluralism", "international worker solidarity only", "complete gender equality"],
 "They rejected liberal democracy and often targeted minorities.",
 ),
 item(
 "u7-holo",
 "The Holocaust was",
 "a systematic, state-sponsored genocide of European Jews and targeted groups",
 ["a myth with no documentation", "only a local riot", "unrelated to Nazi ideology"],
 "Industrial-scale murder marked racial war aims.",
 ),
 item(
 "u7-atl",
 "The Atlantic Charter (1941) articulated goals such as",
 "self-determination and freer trade among Allied war aims",
 ["dividing Poland with the USSR permanently", "restoring all colonies unchanged", "avoiding any UN"],
 "It framed postwar hopes despite colonial realities.",
 ),
 item(
 "u7-dday",
 "D-Day (1944) represented",
 "a massive Anglo-American amphibious invasion to liberate Nazi-occupied France",
 ["the start of WWI", "the Russian Civil War", "the Korean armistice"],
 "Second front pressure complemented the Eastern Front.",
 ),
 item(
 "u7-un",
 "The United Nations (1945) was created partly to",
 "provide forums for diplomacy and (uneven) peace enforcement",
 ["abolish all nation-states", "end nuclear weapons entirely in 1945", "dissolve colonies instantly"],
 "The UN built on League experience with new institutions.",
 ),
];

/* - - - Unit 8: Cold War and Decolonization - - - */

const WH_U8: WhQuestionGen[] = [
 item(
 "u8-contain",
 "The Truman Doctrine is associated with",
 "US commitment to aid countries resisting communism (containment)",
 ["isolation from Europe", "supporting Soviet expansion", "abolishing NATO before it existed"],
 "Containment framed US Cold War strategy.",
 ),
 item(
 "u8-nato",
 "NATO and the Warsaw Pact exemplified",
 "military alliance blocs in divided Cold War Europe",
 ["African decolonization only", "Asian trade pacts only", "complete global neutrality"],
 "Armed camps faced each other across the 'Iron Curtain'.",
 ),
 item(
 "u8-partition",
 "Indian independence (1947) involved",
 "partition into India and Pakistan amid mass migration and violence",
 ["peaceful reunification of Korea", "creation of Israel in 1917", "dissolution of the USSR"],
 "Communal violence accompanied the British exit.",
 ),
 item(
 "u8-china",
 "The Chinese Communist victory in 1949",
 "ended Nationalist rule on the mainland and founded the PRC",
 ["restored the Qing dynasty", "abolished all industry", "joined NATO"],
 "Mao's regime aligned later with the Soviet bloc then split.",
 ),
 item(
 "u8-korea",
 "The Korean War (1950-53) featured",
 "UN/US intervention against North Korean invasion and Chinese entry",
 ["French war in Algeria only", "the Cuban Missile Crisis only", "Vietnam unification"],
 "Armistice left a divided peninsula.",
 ),
 item(
 "u8-viet",
 "US involvement in Vietnam escalated as part of",
 "containment and domino-theory fears in Southeast Asia",
 ["supporting Ho from 1945 openly", "abolishing communism globally in 1950", "ignoring France"],
 "Guerrilla war and limits of airpower shaped outcomes.",
 ),
 item(
 "u8-cuban",
 "The Cuban Missile Crisis (1962) concerned",
 "Soviet nuclear missiles deployed near the United States",
 ["the Suez Crisis only", "Berlin airlift supplies", "Chinese Civil War"],
 "Brinkmanship ended with a secret compromise.",
 ),
 item(
 "u8-apart",
 "Apartheid in South Africa was resisted by movements including",
 "the ANC and international sanctions pressure",
 ["universal white support", "abolition of all mining", "immediate nuclear disarmament"],
 "Mandela's leadership symbolized the long struggle.",
 ),
 item(
 "u8-nam",
 "The Non-Aligned Movement (Bandung era) often sought",
 "independence from both superpower blocs",
 ["automatic NATO membership", "Soviet annexation of India", "abolishing the UN"],
 "Newly independent states pursued diverse paths.",
 ),
 item(
 "u8-sov",
 "Mikhail Gorbachev's reforms (perestroika/glasnost) contributed to",
 "opening Soviet society and loosening party control",
 ["strengthening the Berlin Wall forever", "invading Western Europe in 1989", "restoring Stalinism"],
 "Institutional crises ended with the USSR's collapse.",
 ),
];

/* - - - Unit 9: Globalization - - - */

const WH_U9: WhQuestionGen[] = [
 item(
 "u9-wto",
 "The World Trade Organization builds on earlier efforts to",
 "liberalize and regulate international trade through rules and dispute panels",
 ["abolish all corporations", "end maritime shipping", "ban regional trade blocs"],
 "GATT/WTO institutionalized trade negotiations.",
 ),
 item(
 "u9-nafta",
 "Agreements like NAFTA/USMCA aimed to",
 "integrate North American markets with phased tariff cuts",
 ["isolate Mexico entirely", "abolish the US dollar", "end Canadian sovereignty"],
 "Regional blocs coexist with global supply chains.",
 ),
 item(
 "u9-911",
 "The September 11, 2001 attacks led to",
 "a US-led 'war on terror' and intervention in Afghanistan",
 ["immediate EU dissolution", "the end of NATO", "abolishing Islam globally"],
 "Security politics reshaped borders and civil liberties debates.",
 ),
 item(
 "u9-china",
 "China's post-1978 reforms combined",
 "market incentives with continued party-state leadership",
 ["immediate multiparty democracy", "return to Mao-era communes", "abolishing exports"],
 "Special economic zones drove export-led growth.",
 ),
 item(
 "u9-india",
 "India's 1991 liberalization helped transform it into",
 "a major services and technology hub in the world economy",
 ["an autarkic closed economy", "a Soviet satellite", "a colony again"],
 "Domestic reform met global outsourcing trends.",
 ),
 item(
 "u9-climate",
 "Global environmental governance debates often center on",
 "who bears costs for emissions and technology transfers",
 ["ignoring science entirely", "ending all industry in 1990", "local-only issues with no spillovers"],
 "UNFCCC/COP processes highlight North-South equity fights.",
 ),
 item(
 "u9-who",
 "Global health challenges such as HIV/AIDS and COVID-19 show",
 "unequal access to medicines and infrastructure",
 ["perfect equality of outcomes", "no role for WHO/NGOs", "disease respecting borders"],
 "Pandemics expose global interdependence.",
 ),
 item(
 "u9-net",
 "The Internet and social media accelerated",
 "rapid information diffusion and new forms of surveillance and mobilization",
 ["the end of all nationalism", "zero censorship anywhere", "abolishing English"],
 "Digital networks empower both activists and authoritarians.",
 ),
 item(
 "u9-mig",
 "Late 20th-21st century migration patterns include",
 "labor migration, refugees from conflict, and diaspora remittances",
 ["complete end of cross-border movement", "only rural-to-rural moves", "no policy responses"],
 "States balance openness with security and welfare concerns.",
 ),
 item(
 "u9-terror",
 "International institutions addressing war crimes include",
 "the International Criminal Court (limited membership/enforcement)",
 ["a universal world government", "courts with power everywhere automatically", "no Geneva Conventions"],
 "Justice remains selective and politically contested.",
 ),
];

const WH_BY_UNIT: WhQuestionGen[][] = [
 [...WH_U1_DYNAMIC, ...WH_U1_DYNAMIC, ...WH_U1_DYNAMIC, ...WH_U1],
 [...WH_U2_DYNAMIC, ...WH_U2_DYNAMIC, ...WH_U2_DYNAMIC, ...WH_U2],
 [...WH_U3_DYNAMIC, ...WH_U3_DYNAMIC, ...WH_U3_DYNAMIC, ...WH_U3],
 [...WH_U4_DYNAMIC, ...WH_U4_DYNAMIC, ...WH_U4_DYNAMIC, ...WH_U4],
 [...WH_U5_DYNAMIC, ...WH_U5_DYNAMIC, ...WH_U5_DYNAMIC, ...WH_U5],
 [...WH_U6_DYNAMIC, ...WH_U6_DYNAMIC, ...WH_U6_DYNAMIC, ...WH_U6],
 [...WH_U7_DYNAMIC, ...WH_U7_DYNAMIC, ...WH_U7_DYNAMIC, ...WH_U7],
 [...WH_U8_DYNAMIC, ...WH_U8_DYNAMIC, ...WH_U8_DYNAMIC, ...WH_U8],
 [...WH_U9_DYNAMIC, ...WH_U9_DYNAMIC, ...WH_U9_DYNAMIC, ...WH_U9],
];

export function getWorldHistoryGeneratorsForUnit(unitIndex: number): WhQuestionGen[] {
 const i = Math.min(9, Math.max(1, Math.floor(unitIndex))) - 1;
 return WH_BY_UNIT[i] ?? WH_BY_UNIT[0];
}
