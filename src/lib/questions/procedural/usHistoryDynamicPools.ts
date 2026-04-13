/**
 * Parametric U.S. history items - stems vary by RNG; scoped to nine chronological spans.
 */
import { ushMc, type UshQuestionGen } from "./usHistoryCore";
import { pick, pickThreeDistinct } from "./utils";

const WRONG_EARLY = [
 "indigenous societies left no trace in the landscape before sustained European contact",
 "the Columbian Exchange moved only ideas, not plants, animals, or microbes",
 "Spanish colonial labor systems had no connection to coerced work or extraction",
 "English colonization ignored joint-stock company funding entirely",
 "French colonists in North America typically arrived in massive farming villages only",
] as const;

const WRONG_COL = [
 "salutary neglect meant Parliament tightly managed every colonial town meeting",
 "the Navigation Acts encouraged colonies to trade freely with all European rivals equally",
 "Bacon's Rebellion was primarily a conflict over tea taxes in Boston",
 "the Great Awakening discouraged any new religious enthusiasm in the colonies",
 "the Albany Plan was universally ratified and created a permanent colonial parliament",
] as const;

const WRONG_REV = [
 "the Stamp Act targeted only enslaved laborers, not documents or courts",
 "the Olive Branch Petition demanded immediate independence in 1775",
 "the Articles of Confederation gave Congress strong taxing power from the start",
 "the Constitutional Convention unanimously banned any federal judiciary",
 "Washington's Farewell Address urged permanent military alliances with Europe",
] as const;

const WRONG_EARLY_REP = [
 "the War of 1812 ended with Britain ceding Canada to the United States",
 "the Missouri Compromise banned slavery everywhere in the Louisiana Purchase",
 "Andrew Jackson expanded federal banking power by rechartering the Second BUS enthusiastically",
 "the Erie Canal mainly connected the Pacific coast to New England",
 "the Seneca Falls Convention focused exclusively on railroad subsidies",
] as const;

const WRONG_CIVIL = [
 "the Wilmot Proviso was designed to expand slavery into all Mexican Cession lands",
 "the Emancipation Proclamation freed all enslaved people in the United States immediately in 1863",
 "Reconstruction ended with unanimous land redistribution to every freed family",
 "the Fifteenth Amendment granted women's suffrage nationwide in 1870",
 "the Compromise of 1877 installed Ulysses S. Grant for a third presidential term",
] as const;

const WRONG_GILDED = [
 "the Populist Party's Omaha Platform chiefly demanded a gold-only currency forever",
 "the Sherman Antitrust Act was interpreted from day one to break up every trust successfully",
 "Jim Crow laws were struck down nationwide by Plessy v. Ferguson",
 "the Spanish-American War ended with Spain keeping the Philippines indefinitely",
 "Turner's Frontier Thesis claimed the frontier had no effect on U.S. society",
] as const;

const WRONG_MODERN = [
 "the New Deal eliminated unemployment entirely within Roosevelt's first hundred days",
 "the U.S. entered World War I in 1914 alongside Britain from the start",
 "Japanese American internment during World War II was ruled unconstitutional by every court",
 "the Fair Deal passed every major civil rights bill Harry Truman proposed without opposition",
 "the Marshall Plan primarily funded Soviet industrialization",
] as const;

const WRONG_COLD = [
 "Brown v. Board upheld 'separate but equal' as permanently constitutional in 1954",
 "the Gulf of Tonkin Resolution explicitly declared war on North Vietnam by name",
 "the War Powers Resolution strengthened presidential authority to start wars without notice",
 "the Voting Rights Act of 1965 applied only to the state of Mississippi",
 "Watergate led to Richard Nixon's re-election in 1974",
] as const;

const WRONG_RECENT = [
 "the Immigration and Nationality Act of 1965 eliminated all immigration to the United States",
 "NAFTA was a military alliance between the U.S., Canada, and Mexico",
 "the Gramm-Leach-Bliley Act of 1999 reinstated Glass-Steagall's original separation",
 "the Affordable Care Act was ratified as a constitutional amendment in 2010",
 "popular vote winners always receive a majority of electoral votes under current rules",
] as const;

function wrong3(rng: () => number, pool: readonly string[], correct: string): [string, string, string] {
 return pickThreeDistinct(rng, [...pool], correct);
}

export const USH_U1_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const t = pick(rng, ["maize cultivation", "long-distance trade networks", "diverse political structures"]);
 const correct = pick(rng, [
 "scholars emphasize adaptation, exchange, and power within and among societies",
 "regions differed sharply in economy, settlement, and diplomacy before sustained European colonization",
 "indigenous histories are central rather than a blank prelude to European arrival",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY, correct);
 return ushMc(rng, ctx, i, `u1dyn-${i}`, `Historians highlight ${t} in pre-contact North America partly because`, correct, w1, w2, w3, "Indigenous North America is analyzed as diverse, dynamic societies on their own terms.");
 },
 (rng, ctx, i) => {
 const ex = pick(rng, ["horses", "wheat", "smallpox", "potatoes"]);
 const correct = pick(rng, [
 "the Columbian Exchange reshaped diets, labor, demographics, and power on both sides of the Atlantic",
 "biological and ecological transfers were as consequential as political claims",
 "new crops and diseases altered population and settlement patterns for centuries",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY, correct);
 return ushMc(rng, ctx, i, `u1ex-${i}`, `Including ${ex} in the story of early contact matters because`, correct, w1, w2, w3, "Exchange linked continents ecologically and economically.");
 },
 (rng, ctx, i) => {
 const s = pick(rng, ["encomienda", "mission settlements", "mining labor systems"]);
 const correct = pick(rng, [
 "Spanish colonial rule combined extraction, Catholic missionization, and coerced labor",
 "indigenous polities faced disease, displacement, and new legal hierarchies",
 "profits and religious goals intertwined in Iberian expansion",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY, correct);
 return ushMc(rng, ctx, i, `u1sp-${i}`, `Analyzing ${s} helps explain`, correct, w1, w2, w3, "Labor and belief systems structured Spanish America.");
 },
 (rng, ctx, i) => {
 const comp = pick(rng, ["English joint-stock ventures", "French fur-trade alliances", "Dutch commercial outposts"]);
 const correct = pick(rng, [
 "rival empires pursued different settlement densities and relationships with Native nations",
 "trade goals, religion, and geography produced distinct colonial patterns",
 "no single European model dominated the continent in this era",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY, correct);
 return ushMc(rng, ctx, i, `u1cmp-${i}`, `Comparing ${comp} with other European projects shows that`, correct, w1, w2, w3, "Colonization was contested and varied.");
 },
 (rng, ctx, i) => {
 const a = pick(rng, ["disease mortality", "diplomatic misunderstandings", "competition for fur and land"]);
 const correct = pick(rng, [
 "Native nations negotiated, resisted, and adapted amid shifting power balances",
 "violence and trade coexisted in many borderlands",
 "indigenous diplomacy shaped whether colonies survived or expanded",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY, correct);
 return ushMc(rng, ctx, i, `u1na-${i}`, `Stressing ${a} in contact-era history highlights that`, correct, w1, w2, w3, "Indigenous agency belongs at the center of the narrative.");
 },
];

export const USH_U2_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const p = pick(rng, ["tobacco profits", "headrights", "indentured labor"]);
 const correct = pick(rng, [
 "Chesapeake growth tied land, labor scarcity, and cash-crop expansion together",
 "elites experimented with labor systems to sustain export agriculture",
 "migration patterns skewed heavily toward young men in some colonies",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COL, correct);
 return ushMc(rng, ctx, i, `u2ch-${i}`, `Linking ${p} to Chesapeake development shows`, correct, w1, w2, w3, "Economic incentives shaped colonial social structure.");
 },
 (rng, ctx, i) => {
 const n = pick(rng, ["town meetings", "covenant theology", "literacy for Bible reading"]);
 const correct = pick(rng, [
 "New England communities emphasized religious discipline and local participation",
 "migration often moved whole families seeking religious reform",
 "law and moral economy intertwined in daily life",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COL, correct);
 return ushMc(rng, ctx, i, `u2ne-${i}`, `Features such as ${n} illustrate that`, correct, w1, w2, w3, "Regional cultures diverged within British America.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["Navigation Acts", "mercantilist assumptions", "triangular trade patterns"]);
 const correct = pick(rng, [
 "imperial policy aimed to benefit the metropole while colonists sought loopholes and autonomy",
 "trade rules structured ports, smuggling, and resentment",
 "economic ties pulled colonies toward Atlantic markets",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COL, correct);
 return ushMc(rng, ctx, i, `u2merc-${i}`, `Studying ${m} matters for understanding colonial economies because`, correct, w1, w2, w3, "Mercantilism framed imperial relationships.");
 },
 (rng, ctx, i) => {
 const e = pick(rng, ["Bacon's Rebellion", "Salem witch trials", "Stono Rebellion"]);
 const correct = pick(rng, [
 "local conflicts exposed class tension, fear, and labor control in slave societies",
 "frontier pressure and racial hierarchy shaped violence and law",
 "events became touchstones for later interpretations of colonial society",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COL, correct);
 return ushMc(rng, ctx, i, `u2ev-${i}`, `Historians cite ${e} partly to show`, correct, w1, w2, w3, "Unrest revealed fractures beneath colonial stability.");
 },
 (rng, ctx, i) => {
 const r = pick(rng, ["Jonathan Edwards", "George Whitefield", "Halfway Covenant debates"]);
 const correct = pick(rng, [
 "revivalism reshaped churches, gender roles, and public speech across colonies",
 "new religious enthusiasm interacted with Enlightenment ideas unevenly",
 "Awakening networks foreshadowed political mobilization later",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COL, correct);
 return ushMc(rng, ctx, i, `u2ga-${i}`, `The First Great Awakening's figures and conflicts - including ${r} - are significant because`, correct, w1, w2, w3, "Religious change was a social force.");
 },
];

export const USH_U3_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const w = pick(rng, ["Fort Duquesne", "Ohio River land claims", "alliance diplomacy with Native nations"]);
 const correct = pick(rng, [
 "imperial competition drew colonists into wider wars for empire",
 "British victory reshaped maps, debts, and Native expectations",
 "colonists gained confidence and experience in military mobilization",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_REV, correct);
 return ushMc(rng, ctx, i, `u3fiw-${i}`, `The Seven Years' War context around ${w} matters because`, correct, w1, w2, w3, "The war rearranged power in North America.");
 },
 (rng, ctx, i) => {
 const t = pick(rng, ["Sugar Act enforcement", "Stamp Act protests", "Boston Massacre propaganda"]);
 const correct = pick(rng, [
 "disputes over representation and sovereignty escalated into coordinated resistance",
 "colonists experimented with boycotts, petitions, and crowd actions",
 "ideas about rights intertwined with street politics and print culture",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_REV, correct);
 return ushMc(rng, ctx, i, `u3tax-${i}`, `Tracing ${t} helps explain how`, correct, w1, w2, w3, "Tax and trade fights politicized colonists.");
 },
 (rng, ctx, i) => {
 const d = pick(rng, ["natural rights philosophy", "lists of grievances against the king", "consent of the governed"]);
 const correct = pick(rng, [
 "independence was justified with republican and liberal arguments about legitimacy",
 "the document linked revolution to broader Atlantic debates",
 "tensions over slavery and equality were embedded even in founding language",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_REV, correct);
 return ushMc(rng, ctx, i, `u3dec-${i}`, `The Declaration's emphasis on ${d} shows that`, correct, w1, w2, w3, "Ideas mattered alongside military struggle.");
 },
 (rng, ctx, i) => {
 const a = pick(rng, ["weak taxation", "state sovereignty", "fear of standing armies"]);
 const correct = pick(rng, [
 "the first national government struggled to fund debts and regulate commerce",
 "elite reformers sought stronger institutions without replicating British monarchy",
 "crises like Shays's Rebellion highlighted fiscal-military limits",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_REV, correct);
 return ushMc(rng, ctx, i, `u3art-${i}`, `Under the Articles, issues such as ${a} reflected`, correct, w1, w2, w3, "Confederation-era weaknesses drove constitutional debate.");
 },
 (rng, ctx, i) => {
 const c = pick(rng, ["federalism", "separation of powers", "the amendment process"]);
 const correct = pick(rng, [
 "framers tried to balance liberty, order, and sectional interests",
 "debates over slavery and representation shaped compromises",
 "ratification battles produced Federalist defenses and Anti-Federalist warnings",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_REV, correct);
 return ushMc(rng, ctx, i, `u3con-${i}`, `The Constitution's design around ${c} is historically important because`, correct, w1, w2, w3, "Institutions framed future conflict.");
 },
];

export const USH_U4_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const j = pick(rng, ["strict construction doubts", "doubling national territory", "negotiation with France"]);
 const correct = pick(rng, [
 "executive action and party conflict tested constitutional limits in practice",
 "expansion raised questions about slavery's future in the West",
 "exploration and diplomacy extended U.S. claims across the continent",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY_REP, correct);
 return ushMc(rng, ctx, i, `u4lp-${i}`, `Jefferson's Louisiana Purchase involved ${j}, which illustrates`, correct, w1, w2, w3, "Westward expansion was politically charged.");
 },
 (rng, ctx, i) => {
 const w = pick(rng, ["impressment", "War Hawks", "Native resistance in the Northwest"]);
 const correct = pick(rng, [
 "the war accelerated nationalism, manufacturing interest, and sectional friction",
 "peace reinforced borders but left some maritime issues unresolved",
 "indigenous nations faced continued pressure after Tecumseh's coalition",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY_REP, correct);
 return ushMc(rng, ctx, i, `u41812-${i}`, `Historians connect ${w} to the War of 1812 partly because`, correct, w1, w2, w3, "The war reshaped U.S. identity and diplomacy.");
 },
 (rng, ctx, i) => {
 const m = pick(rng, ["canals", "cotton and textile links", "banking and credit"]);
 const correct = pick(rng, [
 "transport and markets tied regions while intensifying labor systems in the South",
 "economic growth depended on enslaved labor, wage labor, and family farms unevenly",
 "sectional specialization set up later political clashes",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY_REP, correct);
 return ushMc(rng, ctx, i, `u4mr-${i}`, `The Market Revolution's elements like ${m} matter because`, correct, w1, w2, w3, "Capitalism's geography remapped daily life.");
 },
 (rng, ctx, i) => {
 const jack = pick(rng, ["Indian Removal", "the bank veto", "the spoils system"]);
 const correct = pick(rng, [
 "Jacksonian democracy celebrated white male participation while excluding many others",
 "presidential power and popular politics intensified",
 "sovereignty conflicts with Native nations moved toward forced relocation",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY_REP, correct);
 return ushMc(rng, ctx, i, `u4aj-${i}`, `Debates over ${jack} reveal that`, correct, w1, w2, w3, "Democracy and coercion expanded together for some groups.");
 },
 (rng, ctx, i) => {
 const r = pick(rng, ["abolitionism", "women's rights conventions", "transcendentalism"]);
 const correct = pick(rng, [
 "reformers challenged slavery, gender norms, and industrial society's moral costs",
 "religious and secular languages mixed in social movements",
 "activism created organizations and petitions that influenced politics before the Civil War",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_EARLY_REP, correct);
 return ushMc(rng, ctx, i, `u4ref-${i}`, `Antebellum movements such as ${r} are studied because`, correct, w1, w2, w3, "Reform foreshadowed sectional crisis.");
 },
];

export const USH_U5_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const s = pick(rng, ["popular sovereignty debates", "Bleeding Kansas", "the Dred Scott decision"]);
 const correct = pick(rng, [
 "westward expansion repeatedly forced national choices about slavery's future",
 "violence and courts politicized what compromises had papered over",
 "new parties realigned voters along sectional lines",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CIVIL, correct);
 return ushMc(rng, ctx, i, `u5sec-${i}`, `Events like ${s} escalated sectional conflict by`, correct, w1, w2, w3, "Territory and law intertwined with slavery.");
 },
 (rng, ctx, i) => {
 const w = pick(rng, ["Antietam", "Gettysburg", "Grant's Virginia campaigns"]);
 const correct = pick(rng, [
 "military outcomes interacted with diplomacy, emancipation policy, and morale",
 "total-war logistics and casualties redefined the nation-state's capacity",
 "war aims shifted from union alone toward destroying slavery in rebel states",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CIVIL, correct);
 return ushMc(rng, ctx, i, `u5war-${i}`, `Civil War turning points involving ${w} show that`, correct, w1, w2, w3, "Strategy and ideology co-evolved.");
 },
 (rng, ctx, i) => {
 const r = pick(rng, ["Freedmen's Bureau", "Black Codes", "Radical Reconstruction"]);
 const correct = pick(rng, [
 "freedom and citizenship were contested on the ground through labor, violence, and law",
 "federal power expanded to protect civil rights unevenly",
 "African Americans built churches, schools, and political institutions under threat",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CIVIL, correct);
 return ushMc(rng, ctx, i, `u5rec-${i}`, `Studying ${r} highlights`, correct, w1, w2, w3, "Reconstruction was a revolutionary and fragile process.");
 },
 (rng, ctx, i) => {
 const a = pick(rng, ["Thirteenth", "Fourteenth", "Fifteenth"]);
 const correct = pick(rng, [
 "constitutional amendments redefined citizenship, equality, and voting - on paper",
 "implementation depended on courts, Congress, and local enforcement",
 "amendments became tools for later civil rights struggles",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CIVIL, correct);
 return ushMc(rng, ctx, i, `u5am-${i}`, `The ${a} Amendment(s) matter in this era because`, correct, w1, w2, w3, "Law and society diverged often.");
 },
 (rng, ctx, i) => {
 const e = pick(rng, ["the Compromise of 1877", "withdrawal of federal troops", "Redeemer governments"]);
 const correct = pick(rng, [
 "Reconstruction's end reshaped labor, voting, and racial hierarchy in the South",
 "national attention shifted toward industrial disputes and western expansion",
 "African Americans faced disenfranchisement and segregation regimes",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_CIVIL, correct);
 return ushMc(rng, ctx, i, `u5end-${i}`, `Interpreting ${e} helps explain how`, correct, w1, w2, w3, "1877 closed one chapter and opened another.");
 },
];

export const USH_U6_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const g = pick(rng, ["horizontal integration", "trusts", "interstate railroads"]);
 const correct = pick(rng, [
 "industrial concentration raised questions about monopoly, labor, and government power",
 "new corporate forms changed competition and consumer prices",
 "political responses included regulation attempts and judicial limits",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_GILDED, correct);
 return ushMc(rng, ctx, i, `u6ind-${i}`, `Gilded Age developments such as ${g} matter because`, correct, w1, w2, w3, "Big business reshaped daily life.");
 },
 (rng, ctx, i) => {
 const l = pick(rng, ["Knights of Labor", "Haymarket aftermath", "AFL craft strategy"]);
 const correct = pick(rng, [
 "workers experimented with solidarity, strikes, and political language under repression",
 "class conflict shaped cities, courts, and party politics",
 "race and gender divided labor movements internally",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_GILDED, correct);
 return ushMc(rng, ctx, i, `u6lab-${i}`, `Labor history featuring ${l} shows`, correct, w1, w2, w3, "Industrialization was contested on shop floors.");
 },
 (rng, ctx, i) => {
 const p = pick(rng, ["free silver", "railroad regulation demands", "farmers' cooperatives"]);
 const correct = pick(rng, [
 "agrarian protest challenged eastern banks and railroad pricing power",
 "Populists built third-party pressure that influenced later reforms",
 "sectional economic grievances fed political realignment",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_GILDED, correct);
 return ushMc(rng, ctx, i, `u6pop-${i}`, `Populist themes like ${p} reflected`, correct, w1, w2, w3, "Rural crisis drove political innovation.");
 },
 (rng, ctx, i) => {
 const imp = pick(rng, ["Hawaii annexation debate", "Cuban war context", "Philippine insurgency"]);
 const correct = pick(rng, [
 "empire raised constitutional questions and racial ideologies about overseas rule",
 "markets, navy power, and nationalism intertwined",
 "anti-imperialists contested expansion in Congress and print",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_GILDED, correct);
 return ushMc(rng, ctx, i, `u6imp-${i}`, `Debates around ${imp} show that`, correct, w1, w2, w3, "1898 accelerated America's global role.");
 },
 (rng, ctx, i) => {
 const j = pick(rng, ["Jim Crow laws", "disenfranchisement devices", "Plessy's logic"]);
 const correct = pick(rng, [
 "segregation was built through law, custom, and terror after Reconstruction",
 "African Americans organized schools, businesses, and legal challenges despite risks",
 "national politics often accommodated white supremacy for decades",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_GILDED, correct);
 return ushMc(rng, ctx, i, `u6jc-${i}`, `Analyzing ${j} clarifies how`, correct, w1, w2, w3, "Racial hierarchy was enforced multi-dimensionally.");
 },
];

export const USH_U7_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const pr = pick(rng, ["muckrakers", "regulation of trusts", "conservation"]);
 const correct = pick(rng, [
 "Progressives used government, expertise, and publicity to address industrial harms",
 "tensions pitted efficiency against democracy and imperial ambition against reform",
 "women's activism expanded public roles in settlement houses and suffrage fights",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
 return ushMc(rng, ctx, i, `u7prog-${i}`, `Progressive-era emphases on ${pr} illustrate`, correct, w1, w2, w3, "Reform redefined the state's role.");
 },
 (rng, ctx, i) => {
 const w = pick(rng, ["selective service", "Committee on Public Information", "Espionage and Sedition Acts"]);
 const correct = pick(rng, [
 "wartime mobilization expanded federal power and curtailed dissent",
 "labor migration and Great Migration reshaped cities and industries",
 "Versailles outcomes disappointed many expectations and seeded later conflicts",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
 return ushMc(rng, ctx, i, `u7ww1-${i}`, `World War I developments such as ${w} show`, correct, w1, w2, w3, "Total war transformed society.");
 },
 (rng, ctx, i) => {
 const nd = pick(rng, ["banking reform", "agricultural adjustment", "relief work programs"]);
 const correct = pick(rng, [
 "the New Deal experimented with federal economic management and social insurance",
 "critics on the left and right pressured Roosevelt's coalition",
 "institutions like Social Security outlasted the Depression emergency",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
 return ushMc(rng, ctx, i, `u7nd-${i}`, `New Deal elements including ${nd} matter historically because`, correct, w1, w2, w3, "Crisis governance remade expectations of Washington.");
 },
 (rng, ctx, i) => {
 const ww2 = pick(rng, ["Rosie the Riveter symbolism", "Japanese American internment", "Double V campaign"]);
 const correct = pick(rng, [
 "the war advanced rights claims and contradictions simultaneously",
 "mobilization ended the Depression but intensified discrimination and protest",
 "global conflict set the stage for postwar civil rights and Cold War security states",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
 return ushMc(rng, ctx, i, `u7ww2-${i}`, `Themes like ${ww2} highlight that`, correct, w1, w2, w3, "World War II was a social revolution as well as military.");
 },
 (rng, ctx, i) => {
 const h = pick(rng, ["the GI Bill", "suburban growth", "Sun Belt migration"]);
 const correct = pick(rng, [
 "postwar prosperity was unevenly distributed by race, gender, and region",
 "federal policy shaped housing markets and educational opportunity",
 "consumer culture and car infrastructure redefined landscapes",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
 return ushMc(rng, ctx, i, `u7post-${i}`, `Post-World War II trends such as ${h} suggest`, correct, w1, w2, w3, "The 1940s-1950s laid modern inequality patterns.");
 },
];

export const USH_U8_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const c = pick(rng, ["containment", "Marshall Plan aid", "NATO formation"]);
 const correct = pick(rng, [
 "the U.S. led institutions meant to rebuild allies and limit Soviet expansion",
 "economic and military commitments redefined peacetime foreign policy",
 "debates over intervention began early in Europe and Asia",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COLD, correct);
 return ushMc(rng, ctx, i, `u8cw-${i}`, `Early Cold War tools like ${c} show`, correct, w1, w2, w3, "Superpower rivalry structured domestic life.");
 },
 (rng, ctx, i) => {
 const cr = pick(rng, ["Montgomery bus boycott", "Little Rock", "March on Washington"]);
 const correct = pick(rng, [
 "grassroots organizing pressured courts, Congress, and presidents",
 "television broadcast brutality that shifted national opinion",
 "civil rights laws still required grassroots enforcement afterward",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COLD, correct);
 return ushMc(rng, ctx, i, `u8cr-${i}`, `Civil rights struggles including ${cr} demonstrate`, correct, w1, w2, w3, "Rights expanded through movement pressure.");
 },
 (rng, ctx, i) => {
 const v = pick(rng, ["Gulf of Tonkin framing", "Tet Offensive effects", "antiwar protests"]);
 const correct = pick(rng, [
 "Vietnam divided generations, parties, and ideas about American power",
 "the draft and casualties intensified dissent and skepticism of officials",
 "endings in 1973-1975 reshaped confidence in containment doctrine",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COLD, correct);
 return ushMc(rng, ctx, i, `u8vn-${i}`, `Analyzing ${v} helps explain`, correct, w1, w2, w3, "Vietnam was a watershed in foreign and cultural politics.");
 },
 (rng, ctx, i) => {
 const n = pick(rng, ["detente", "Watergate investigations", "stagflation pressures"]);
 const correct = pick(rng, [
 "the 1970s mixed reform momentum with cynicism about government and economy",
 "presidential power faced new congressional and media checks",
 "energy shocks intersected with Middle East diplomacy",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COLD, correct);
 return ushMc(rng, ctx, i, `u870s-${i}`, `Themes like ${n} capture how`, correct, w1, w2, w3, "The decade questioned postwar liberal consensus.");
 },
 (rng, ctx, i) => {
 const f = pick(rng, ["second-wave feminism", "environmental legislation", "conservative mobilization"]);
 const correct = pick(rng, [
 "social movements redefined rights, regulation, and party coalitions",
 "culture wars linked gender, race, religion, and foreign policy",
 "backlash and progress coexisted in law and public opinion",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_COLD, correct);
 return ushMc(rng, ctx, i, `u8soc-${i}`, `Late-century developments such as ${f} illustrate`, correct, w1, w2, w3, "The 1960s-1980s rearranged political identities.");
 },
];

export const USH_U9_DYNAMIC: UshQuestionGen[] = [
 (rng, ctx, i) => {
 const r = pick(rng, ["supply-side tax cuts", "defense spending debates", "deregulation"]);
 const correct = pick(rng, [
 "1980s politics reframed government's economic role and Cold War posture",
 "inequality and debt patterns stirred ongoing debate",
 "conservative coalitions blended religious, economic, and foreign-policy goals",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_RECENT, correct);
 return ushMc(rng, ctx, i, `u9reag-${i}`, `Reagan-era priorities around ${r} reflect`, correct, w1, w2, w3, "Domestic and global strategy intertwined.");
 },
 (rng, ctx, i) => {
 const e = pick(rng, ["NAFTA debates", "post-1991 globalization", "tech-sector growth"]);
 const correct = pick(rng, [
 "trade and technology reshaped jobs, migration, and party alignments",
 "winners and losers from integration fueled political conflict",
 "regulatory choices about finance and labor drew scrutiny after 2008",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_RECENT, correct);
 return ushMc(rng, ctx, i, `u9econ-${i}`, `Late 20th-21st century issues like ${e} show`, correct, w1, w2, w3, "The economy became more transnational.");
 },
 (rng, ctx, i) => {
 const topic = pick(rng, ["1965 immigration law shifts", "bipartisan reform debates", "demographic diversification"]);
 const correct = pick(rng, [
 "migration policy connects to labor markets, civil rights, and national identity",
 "border enforcement and legalization proposals recur in cycles",
 "ethnic politics influences swing states and coalition-building",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_RECENT, correct);
 return ushMc(rng, ctx, i, `u9imm-${i}`, `Studying ${topic} helps explain`, correct, w1, w2, w3, "Immigration is central to modern U.S. history.");
 },
 (rng, ctx, i) => {
 const sec = pick(rng, ["War on Terror debates", "expanded surveillance powers", "long wars in Afghanistan and Iraq"]);
 const correct = pick(rng, [
 "foreign policy after 2001 reshaped civil liberties debates and military spending",
 "intelligence agencies grew while public trust fluctuated",
 "human rights and security tradeoffs became persistent questions",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_RECENT, correct);
 return ushMc(rng, ctx, i, `u9fp-${i}`, `Themes such as ${sec} illustrate`, correct, w1, w2, w3, "21st-century security states built on Cold War precedents.");
 },
 (rng, ctx, i) => {
 const d = pick(rng, ["political polarization", "digital media ecosystems", "pandemic-era federalism"]);
 const correct = pick(rng, [
 "recent decades show continuity and change in parties, rights, and governance",
 "historians emphasize structure - not just personalities - to explain outcomes",
 "interpretation remains contested as archives and voters evolve",
 ]);
 const [w1, w2, w3] = wrong3(rng, WRONG_RECENT, correct);
 return ushMc(rng, ctx, i, `u9now-${i}`, `Discussing ${d} in historical context highlights that`, correct, w1, w2, w3, "Present debates have deep roots.");
 },
];
