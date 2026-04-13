import { ushItem, type UshQuestionGen } from "./usHistoryCore";
import {
  USH_U1_DYNAMIC,
  USH_U2_DYNAMIC,
  USH_U3_DYNAMIC,
  USH_U4_DYNAMIC,
  USH_U5_DYNAMIC,
  USH_U6_DYNAMIC,
  USH_U7_DYNAMIC,
  USH_U8_DYNAMIC,
  USH_U9_DYNAMIC,
} from "./usHistoryDynamicPools";

/* ——— Period 1: 1491–1607 ——— */

const USH_U1: UshQuestionGen[] = [
  ushItem(
    "u1-bering",
    "Scholars associate the first peopling of the Americas most closely with",
    "migration from Asia during eras of lower sea levels",
    ["a single arrival by Polynesian sailors in 1492", "permanent ice bridges to Africa", "ocean voyages directly from western Europe only"],
    "Beringia connected Siberia and Alaska when sea levels dropped.",
  ),
  ushItem(
    "u1-maize",
    "The spread of maize agriculture northward from Mesoamerica is often tied to",
    "economic and population changes among many indigenous societies",
    ["the immediate end of all hunting and gathering", "exclusive reliance on wheat", "the founding of Jamestown"],
    "Maize supported more sedentary communities and trade.",
  ),
  ushItem(
    "u1-columbian",
    "The Columbian Exchange most directly refers to",
    "the transfer of plants, animals, diseases, and peoples across the Atlantic after 1492",
    ["only the export of silver to Asia", "a treaty ending the Seven Years’ War", "the Louisiana Purchase"],
    "Biological and cultural transfers reshaped societies on multiple continents.",
  ),
  ushItem(
    "u1-encom",
    "Under Spain’s encomienda system, colonists typically received",
    "labor access and tribute obligations tied to indigenous communities in exchange for nominal protection and conversion efforts",
    ["fee-simple ownership of all land in Peru", "exclusive English trading rights in Canada", "abolition of Catholic missions"],
    "Encomienda functioned as coerced labor extraction justified by crown grants.",
  ),
  ushItem(
    "u1-norse",
    "Norse expeditions to North America around 1000 CE are historically notable because",
    "they show transatlantic contact long before sustained Iberian colonization",
    ["they established permanent Mexican silver mines", "they created the House of Burgesses", "they ended the French and Indian War"],
    "Vinland did not produce the lasting empires of later European states.",
  ),
  ushItem(
    "u1-fig",
    "According to the table, which crop moved from the Americas to Afro-Eurasia in this simplified exchange list?",
    "Potato",
    ["Rice", "Wheat", "Sugar cane"],
    "New World crops like potatoes and maize transformed Old World diets.",
    {
      kind: "table",
      title: "Columbian Exchange — selected transfers (illustrative)",
      headers: ["Item", "Direction"],
      rows: [
        ["Horses", "Old World → Americas"],
        ["Potatoes", "Americas → Old World"],
        ["Rice", "Old World → Americas"],
        ["Wheat", "Old World → Americas"],
      ],
    },
  ),
  ushItem(
    "u1-columbus",
    "Christopher Columbus’s 1492 voyages are often said to mark the opening of an era of",
    "sustained European contact and colonization in the Americas (after earlier but limited Norse presence)",
    ["proof that no one had ever crossed the Atlantic before", "immediate English settlement of New England", "the end of maize cultivation in Mexico"],
    "Norse contacts around 1000 CE did not produce the same lasting Iberian empires and exchange systems.",
  ),
  ushItem(
    "u1-roanoke",
    "England’s Roanoke settlement (1587) is mainly remembered today because",
    "the colonists had vanished by about 1590, producing the “Lost Colony” mystery",
    ["it became the capital of Spanish Florida", "it issued the Declaration of Independence", "it founded the Massachusetts Bay Company"],
    "Raleigh’s venture failed before England’s later push succeeded at Jamestown.",
  ),
  ushItem(
    "u1-jamestown-1607",
    "The founding of Jamestown in 1607 matters in the standard chronology partly because",
    "it marks England’s first permanent settlement in what became the United States",
    ["it ended the Columbian Exchange", "it was the first French outpost in Canada", "it immediately abolished the Virginia Company"],
    "Survival was precarious; the colony later pivoted toward tobacco and new labor systems.",
  ),
  ushItem(
    "u1-taino",
    "On first landfall in the Caribbean, Columbus encountered peoples such as the Taíno; Spanish claims rested on",
    "royal authorization and papal bulls justifying conquest paired with quests for wealth and Christian conversion",
    ["immediate democratic self-government for Native nations", "recognition of Native title under English common law", "abolition of slavery across the empire"],
    "Conquest brought catastrophic disease and forced labor alongside resistance and adaptation.",
  ),
  ushItem(
    "u1-atlantic-slave",
    "The transatlantic slave trade in this early era is most accurately described as",
    "a brutal system moving enslaved Africans to European colonies, especially in Caribbean and South American plantation zones",
    ["limited entirely to North American factories after 1865", "primarily a trade in indentured English laborers", "abolished by the U.S. Constitution in 1787"],
    "English North American plantation slavery expanded more fully in later decades but was part of the same Atlantic system.",
  ),
];

/* ——— Period 2: 1607–1754 ——— */

const USH_U2: UshQuestionGen[] = [
  ushItem(
    "u2-jamestown",
    "The Virginia Company’s Jamestown settlement (1607) initially struggled chiefly because",
    "many settlers lacked agricultural skills and prioritized quick wealth over stable food production",
    ["gold strikes immediately made everyone rich", "the Spanish navy blockaded New England", "the French captured the St. Lawrence entirely"],
    "Starvation, disease, and leadership crises nearly ended the colony.",
  ),
  ushItem(
    "u2-hob",
    "The House of Burgesses (1619) is significant as",
    "an early elected assembly in English North America",
    ["the first national constitution", "a treaty with France ending the War of 1812", "the document ending slavery in Virginia"],
    "It symbolized limited representative politics alongside royal authority.",
  ),
  ushItem(
    "u2-mayflower",
    "The Mayflower Compact is best understood as",
    "a mutual agreement to create civic government by consent among male settlers",
    ["Parliament’s repeal of the Stamp Act", "a French alliance during the French and Indian War", "Hamilton’s plan for a national bank"],
    "It framed self-rule in a corporate colony context.",
  ),
  ushItem(
    "u2-nav",
    "British Navigation Acts (17th–18th centuries) aimed to",
    "steer colonial trade toward England and restrict rival European commerce",
    ["abolish slavery in all colonies immediately", "grant universal suffrage", "transfer Louisiana to Spain"],
    "Mercantilism prioritized metropole wealth and shipping control.",
  ),
  ushItem(
    "u2-bacon",
    "Bacon’s Rebellion (1676) is often interpreted as",
    "a frontier uprising mixing anti-elite resentment with violence toward Native neighbors",
    ["a successful independence movement against Britain", "a slave revolt that ended tobacco", "a Puritan witch trial"],
    "It exposed class tensions within Virginia society.",
  ),
  ushItem(
    "u2-ga",
    "The First Great Awakening contributed to",
    "religious revivals that challenged established ministers and energized new denominations",
    ["the immediate abolition of slavery nationwide", "the ratification of the Constitution in 1789 only", "the purchase of Alaska"],
    "Revivalism reshaped colonial culture and social authority.",
  ),
  ushItem(
    "u2-headright",
    "Virginia’s headright system (1618 onward) offered land grants to settlers chiefly in order to",
    "attract migrants and expand tobacco agriculture while rewarding those who paid for others’ passage",
    ["abolish the House of Burgesses", "ban all trade with the West Indies", "establish religious freedom for all colonists"],
    "Headrights accelerated Chesapeake expansion and tied land to labor recruitment.",
  ),
  ushItem(
    "u2-rolfe",
    "John Rolfe’s development of marketable tobacco in Virginia is historically significant because",
    "it created a profitable export that reshaped labor demand, land use, and conflict with Native nations",
    ["it ended the Navigation Acts", "it caused the Salem witch trials", "it founded Rhode Island for religious dissenters"],
    "Tobacco wealth made the colony viable but intensified exploitation and expansion.",
  ),
  ushItem(
    "u2-salutary",
    "“Salutary neglect” describes a British approach in which",
    "trade laws existed on paper but enforcement was loose, allowing considerable colonial self-direction",
    ["Parliament banned all colonial assemblies", "the king abolished mercantilism entirely", "France controlled all Atlantic ports"],
    "Tighter imperial control after the Seven Years’ War collided with expectations formed in this era.",
  ),
  ushItem(
    "u2-stono",
    "The Stono Rebellion (1739, South Carolina) is notable because",
    "it was a deadly slave uprising that led to harsher slave codes and heightened fear of revolt",
    ["it ended slavery in the southern colonies", "it was led by Nathaniel Bacon", "it resulted in the repeal of the Molasses Act"],
    "Revolts shaped policing, surveillance, and law in slave societies.",
  ),
  ushItem(
    "u2-salem",
    "The Salem witch trials (1692) are often interpreted as reflecting",
    "social fear, religious anxiety, and local tensions in a changing Puritan society",
    ["victory over the French in Quebec", "the ratification of the U.S. Constitution", "the invention of the cotton gin"],
    "Historians debate economic, gender, and frontier stress as contributing factors.",
  ),
  ushItem(
    "u2-penn",
    "William Penn’s Pennsylvania colony is associated with",
    "Quaker leadership, religious toleration for Christians, and rapid settlement through recruitment",
    ["mandatory Anglican worship only", "a royal ban on all immigration", "the immediate abolition of slavery nationwide"],
    "Penn’s policies attracted diverse migrants though Native relations remained contested.",
  ),
  ushItem(
    "u2-georgia",
    "James Oglethorpe’s Georgia colony (1732) initially restricted slavery partly because founders hoped to",
    "reduce social problems they associated with South Carolina’s plantation economy and Spanish border conflict",
    ["copy Virginia’s tobacco system exactly", "join the French fur trade exclusively", "abolish all private property"],
    "Economic pressure later eroded restrictions as elites aligned with regional norms.",
  ),
];

/* ——— Period 3: 1754–1800 ——— */

const USH_U3: UshQuestionGen[] = [
  ushItem(
    "u3-albany",
    "Benjamin Franklin’s Albany Plan (1754) proposed",
    "greater colonial cooperation for defense and taxation, though colonies rejected centralization",
    ["immediate independence from Britain", "the abolition of slavery in Georgia", "a ban on all western settlement"],
    "Intercolonial union foreshadowed later federal debates.",
  ),
  ushItem(
    "u3-proc",
    "The Proclamation of 1763 attempted to",
    "limit colonial settlement west of the Appalachian crest after Pontiac’s War",
    ["grant Texas independence", "open the Ohio Valley unconditionally to all colonists", "end British taxation forever"],
    "It angered land-hungry colonists and speculators.",
  ),
  ushItem(
    "u3-stamp",
    "Colonial opposition to the Stamp Act (1765) emphasized that",
    "Parliament should not levy internal taxes without colonial consent or representation",
    ["only enslaved people should pay taxes", "taxes were acceptable if collected in Spanish dollars", "the king should abolish all courts"],
    "“No taxation without representation” became a rallying cry.",
  ),
  ushItem(
    "u3-art",
    "Under the Articles of Confederation, Congress could not effectively",
    "tax individuals directly or regulate interstate commerce uniformly",
    ["declare war", "sign treaties", "borrow money"],
    "Weak fiscal powers later fueled constitutional reform.",
  ),
  ushItem(
    "u3-comp",
    "The Great Compromise at the Constitutional Convention blended",
    "population-based representation in the House with equal state representation in the Senate",
    ["a unicameral legislature only", "abolition of the executive branch", "immediate women’s suffrage"],
    "It addressed large-state vs small-state fears.",
  ),
  ushItem(
    "u3-wash",
    "George Washington’s Neutrality Proclamation (1793) responded to",
    "European war by steering clear of permanent alliances while trading where possible",
    ["the annexation of Texas", "the Louisiana Purchase negotiations", "the end of Reconstruction"],
    "Early U.S. foreign policy balanced commerce and non-entanglement.",
  ),
  ushItem(
    "u3-common-sense",
    "Thomas Paine’s *Common Sense* (1776) mattered politically because it",
    "popularized arguments for independence and republican government in plain language for a broad audience",
    ["was the same document as the Declaration of Independence", "ended the war with the Treaty of Ghent", "created the Electoral College"],
    "Jefferson’s Declaration came months later as an official congressional statement of grievances.",
  ),
  ushItem(
    "u3-coercive",
    "The Coercive (Intolerable) Acts (1774) primarily targeted Massachusetts by",
    "closing Boston’s port and tightening imperial control after the Boston Tea Party",
    ["granting universal suffrage", "abolishing slavery in Virginia", "annexing Texas"],
    "They pushed many colonists toward coordinated resistance and the First Continental Congress.",
  ),
  ushItem(
    "u3-lexington",
    "Fighting at Lexington and Concord (April 1775) is significant because",
    "it marked open armed conflict between British troops and colonial militias",
    ["it ended the French and Indian War", "it ratified the Constitution", "it announced the Monroe Doctrine"],
    "The Second Continental Congress soon moved toward organizing a continental army.",
  ),
  ushItem(
    "u3-shays",
    "Shays’s Rebellion (1786–87) alarmed many elites because it",
    "showed state governments struggling with debt, taxes, and armed protest under the Articles",
    ["proved slavery had ended nationwide", "was a successful coup by King George III", "abolished the federal judiciary"],
    "Instability helped motivate stronger national government at Philadelphia.",
  ),
  ushItem(
    "u3-fed-papers",
    "The Federalist essays (1787–88) were written chiefly to",
    "defend the proposed Constitution and explain checks and balances to ratification voters—especially in New York",
    ["oppose ratification under all circumstances", "declare war on Britain", "abolish the slave trade immediately"],
    "Madison, Hamilton, and Jay wrote pseudonymously as Publius.",
  ),
  ushItem(
    "u3-xyz",
    "The XYZ Affair (1797–98) increased tensions with France after",
    "French officials sought bribes before negotiating with American diplomats, outraging U.S. public opinion",
    ["the Louisiana Purchase", "the Battle of New Orleans", "the Hartford Convention"],
    "Adams avoided full war but the crisis fed partisan conflict at home.",
  ),
];

/* ——— Period 4: 1800–1848 ——— */

const USH_U4: UshQuestionGen[] = [
  ushItem(
    "u4-marv",
    "Marbury v. Madison (1803) established",
    "judicial review—the Supreme Court’s power to invalidate unconstitutional laws",
    ["popular election of senators", "the two-term presidential limit", "Congress’s sole power to remove presidents"],
    "Marshall’s opinion expanded the judiciary’s role.",
  ),
  ushItem(
    "u4-war1812",
    "The War of 1812 is commonly associated with",
    "British impressment of sailors, western land pressure, and nationalist ambitions in Congress",
    ["the purchase of Alaska from Russia", "the Emancipation Proclamation", "the annexation of Hawaii"],
    "Federalists’ opposition in New England fractured the era’s politics.",
  ),
  ushItem(
    "u4-monroe",
    "The Monroe Doctrine (1823) asserted that",
    "European powers should not seek new colonies in the Americas while the U.S. stayed out of European wars",
    ["Texas was immediately annexed", "Canada joined the Union", "slavery was banned in Missouri"],
    "It was aspirational enforcement-wise but shaped rhetoric for decades.",
  ),
  ushItem(
    "u4-removal",
    "The Indian Removal Act (1830) authorized",
    "negotiated/forced relocation of eastern nations—most infamously Cherokee removal westward",
    ["immediate citizenship for all Native nations", "abolition of slavery in Georgia", "statehood for California"],
    "Supreme Court rulings did not stop Jackson-era enforcement on the ground.",
  ),
  ushItem(
    "u4-texas",
    "The annexation of Texas (1845) intensified national debates because",
    "it threatened to extend slavery and shift sectional balance in Congress",
    ["it ended the Mexican-American War before it began", "it abolished the Second Bank", "it created the Erie Canal"],
    "Expansion and slavery were politically inseparable.",
  ),
  ushItem(
    "u4-seneca",
    "The Seneca Falls Convention (1848) is most associated with",
    "early organized demands for women’s equality, including suffrage",
    ["the founding of the Populist Party", "the Treaty of Versailles", "the Homestead Strike"],
    "It linked abolitionist networks to women’s rights activism.",
  ),
];

/* ——— Period 5: 1844–1877 ——— */

const USH_U5: UshQuestionGen[] = [
  ushItem(
    "u5-wilmot",
    "The Wilmot Proviso aimed to",
    "ban slavery in territory acquired from Mexico",
    ["extend slavery to all new states automatically", "end the transatlantic slave trade in 1808 retroactively", "grant women’s suffrage"],
    "It signaled growing sectional deadlock in Congress.",
  ),
  ushItem(
    "u5-comp50",
    "The Compromise of 1850 included provisions such as",
    "California admitted as a free state and a stronger Fugitive Slave Law",
    ["immediate abolition in every southern state", "popular sovereignty banned everywhere", "construction of the transcontinental railroad completed"],
    "Sectional bargains traded gains and losses for North and South.",
  ),
  ushItem(
    "u5-kn",
    "The Kansas-Nebraska Act (1854) heightened tensions by",
    "allowing popular sovereignty on slavery north of the Missouri Compromise line",
    ["abolishing slavery in Kansas immediately", "banning all settlement in Nebraska", "ending the Dred Scott case"],
    "“Bleeding Kansas” followed from contested migration and voting fraud.",
  ),
  ushItem(
    "u5-ep",
    "The Emancipation Proclamation (1863) declared",
    "freedom for enslaved people in areas still in rebellion as of January 1, 1863",
    ["immediate universal abolition including border states", "the end of the war", "women’s suffrage nationwide"],
    "It tied Union war aims to slavery’s destruction in seceded states.",
  ),
  ushItem(
    "u5-14",
    "The Fourteenth Amendment was designed partly to",
    "define national citizenship and guarantee equal protection under law",
    ["abolish the electoral college", "create the Federal Reserve", "annex the Philippines"],
    "It became a cornerstone for later civil rights litigation.",
  ),
  ushItem(
    "u5-1877",
    "The Compromise of 1877 is associated with",
    "the withdrawal of federal troops from the South and the contested Hayes-Tilden election outcome",
    ["the start of the New Deal", "the Spanish-American War", "the ratification of the 19th Amendment"],
    "It marks the end of Reconstruction as a federal project.",
  ),
];

/* ——— Period 6: 1865–1898 ——— */

const USH_U6: UshQuestionGen[] = [
  ushItem(
    "u6-sherman",
    "The Sherman Antitrust Act (1890) targeted",
    "combinations that restrained interstate trade",
    ["immigration quotas only", "railroad workers’ unions exclusively", "Spanish possession of Cuba forever"],
    "Courts initially narrowed its reach in landmark cases.",
  ),
  ushItem(
    "u6-pop",
    "The Populist Party’s Omaha Platform (1892) emphasized",
    "silver coinage, railroad regulation, and greater economic democracy for farmers and workers",
    ["immediate annexation of Canada", "abolition of all banks overnight", "women’s suffrage as its only plank"],
    "Third-party pressure influenced later reform debates.",
  ),
  ushItem(
    "u6-plessy",
    "Plessy v. Ferguson (1896) ruled that",
    "“separate but equal” segregation did not violate the Fourteenth Amendment",
    ["school prayer was mandatory", "women could vote nationwide", "the income tax was unconstitutional"],
    "It constitutionalized Jim Crow for decades.",
  ),
  ushItem(
    "u6-span",
    "The Spanish-American War (1898) resulted in",
    "U.S. acquisition of Puerto Rico, Guam, and the Philippines and temporary control of Cuba",
    ["the Louisiana Purchase", "the Missouri Compromise", "the end of the War of 1812"],
    "Overseas empire sparked intense domestic debate.",
  ),
  ushItem(
    "u6-icc",
    "The Interstate Commerce Act (1887) created",
    "early federal oversight of railroad rates in interstate commerce",
    ["the Federal Reserve System", "income taxation without amendment", "a ban on all labor unions"],
    "It responded to farmer and shipper complaints about discriminatory pricing.",
  ),
  ushItem(
    "u6-fig",
    "According to the bar chart, which group had the largest share of striking workers reported in this sample year?",
    "Railroad",
    ["Coal", "Textile", "Steel"],
    "Read the tallest bar for the category with maximum strikers.",
    {
      kind: "bar_chart",
      title: "Striking workers by industry (thousands, sample year)",
      yLabel: "Thousands",
      bars: [
        { label: "Coal", value: 42 },
        { label: "Railroad", value: 78 },
        { label: "Textile", value: 31 },
        { label: "Steel", value: 55 },
      ],
    },
  ),
];

/* ——— Period 7: 1890–1945 ——— */

const USH_U7: UshQuestionGen[] = [
  ushItem(
    "u7-ftc",
    "The Federal Trade Commission (1914) and Clayton Act era reforms aimed to",
    "curtail unfair business practices and strengthen antitrust enforcement",
    ["nationalize all railroads permanently", "ban agricultural exports", "end the gold standard immediately in 1890"],
    "Wilson’s “New Freedom” included economic regulation.",
  ),
  ushItem(
    "u7-ww1",
    "American entry into World War I (1917) reflected",
    "unrestricted submarine warfare, economic ties to the Allies, and Wilson’s framing of war for democracy",
    ["the immediate bombing of Pearl Harbor", "the Korean War armistice", "the Louisiana Purchase"],
    "Debates over dissent and mobilization reshaped civil liberties.",
  ),
  ushItem(
    "u7-newdeal",
    "The Social Security Act (1935) established",
    "old-age insurance and unemployment assistance—foundations of the modern welfare state",
    ["immediate universal health insurance for all citizens", "the end of the gold standard in 1789", "women’s suffrage"],
    "It marked a lasting expansion of federal social policy.",
  ),
  ushItem(
    "u7-ww2",
    "Executive Order 9066 (1942) led to",
    "the forced relocation and incarceration of most Japanese Americans on the West Coast",
    ["desegregation of the armed forces in 1942", "the Manhattan Project’s public disclosure", "the founding of NATO"],
    "Civil liberties crises accompanied total war mobilization.",
  ),
  ushItem(
    "u7-gi",
    "The GI Bill (1944) importantly",
    "expanded college access and home loans for returning veterans",
    ["abolished the minimum wage", "created Medicare", "ended the draft permanently"],
    "It reshaped suburbs and higher education.",
  ),
  ushItem(
    "u7-fig",
    "According to the line chart, during which interval did U.S. civilian unemployment rate spike highest?",
    "1929–1933",
    ["1941–1945", "1917–1918", "1896–1900"],
    "The early Depression years show the peak unemployment in this stylized series.",
    {
      kind: "line_chart",
      title: "U.S. civilian unemployment rate (percent, illustrative)",
      yLabel: "%",
      points: [
        { x: "1925–1929", y: 4 },
        { x: "1929–1933", y: 25 },
        { x: "1937–1938", y: 19 },
        { x: "1941–1945", y: 2 },
      ],
    },
  ),
];

/* ——— Period 8: 1945–1980 ——— */

const USH_U8: UshQuestionGen[] = [
  ushItem(
    "u8-truman",
    "The Truman Doctrine (1947) pledged",
    "U.S. support to countries resisting communist insurgency—framing containment",
    ["immediate war on China", "funding for the Erie Canal", "withdrawal from the United Nations"],
    "It set precedent for military and economic aid to allies.",
  ),
  ushItem(
    "u8-brown",
    "Brown v. Board of Education (1954) overturned",
    "Plessy’s “separate but equal” doctrine in public education",
    ["the right to privacy in Griswold", "the constitutionality of the New Deal", "the 22nd Amendment"],
    "Implementation required grassroots struggle and federal intervention.",
  ),
  ushItem(
    "u8-civil",
    "The Civil Rights Act of 1964 banned",
    "discrimination in public accommodations and employment based on race, color, religion, sex, or national origin",
    ["all labor unions", "the draft", "income taxes"],
    "It followed mass protest and presidential leadership.",
  ),
  ushItem(
    "u8-vra",
    "The Voting Rights Act of 1965 targeted",
    "state and local barriers that denied Black citizens effective access to the ballot",
    ["women’s jury service only", "immigration from Asia entirely", "the electoral college’s abolition"],
    "Preclearance provisions addressed literacy tests and poll taxes.",
  ),
  ushItem(
    "u8-watergate",
    "The Watergate scandal culminated in",
    "Richard Nixon’s resignation after evidence of obstruction of justice and abuse of power",
    ["the impeachment of Andrew Johnson in 1868 only", "the Teapot Dome acquittal", "the XYZ Affair"],
    "It reshaped attitudes toward executive secrecy and oversight.",
  ),
  ushItem(
    "u8-carter",
    "Jimmy Carter’s presidency is often linked to",
    "human rights diplomacy, energy challenges, and the Iran hostage crisis",
    ["the Louisiana Purchase", "the annexation of Texas", "the founding of the Populist Party"],
    "Stagflation and global shocks framed late-1970s politics.",
  ),
];

/* ——— Period 9: 1980–Present ——— */

const USH_U9: UshQuestionGen[] = [
  ushItem(
    "u9-reagan",
    "Ronald Reagan’s economic agenda prominently featured",
    "large tax cuts, deregulation, and increased defense spending",
    ["nationalizing major banks in 1981", "immediate universal health care passage", "abolition of the Federal Reserve"],
    "Deficits grew amid debates over supply-side effects.",
  ),
  ushItem(
    "u9-nafta",
    "NAFTA (1993) aimed to",
    "reduce trade barriers among the United States, Canada, and Mexico",
    ["end all immigration from Latin America", "dissolve NATO", "create a common European currency"],
    "It sparked ongoing debate over jobs and sovereignty.",
  ),
  ushItem(
    "u9-1965",
    "The Immigration and Nationality Act of 1965 significantly",
    "replaced national-origin quotas with preferences favoring family reunification and skilled workers",
    ["banned Asian immigration entirely", "granted automatic citizenship to every resident", "ended all refugee admissions"],
    "It contributed to demographic shifts in later decades.",
  ),
  ushItem(
    "u9-911",
    "The USA PATRIOT Act (2001) expanded",
    "surveillance and investigative tools for counterterrorism—prompting civil liberties debates",
    ["Medicare for all", "the Glass-Steagall separation of banks", "the abolition of the CIA"],
    "Security and liberty tradeoffs intensified after 9/11.",
  ),
  ushItem(
    "u9-aca",
    "The Affordable Care Act (2010) sought chiefly to",
    "expand insurance coverage through subsidies, mandates, and Medicaid expansion where accepted",
    ["abolish Social Security", "withdraw from NATO", "nationalize all hospitals outright"],
    "Healthcare politics remained deeply contested afterward.",
  ),
  ushItem(
    "u9-fig",
    "According to the table, which decade interval shows the largest jump in foreign-born share compared with the previous row?",
    "1990–2000",
    ["1970–1980", "1980–1990", "2000–2010"],
    "Subtract each row’s share from the next: the 1990–2000 interval has the largest gain.",
    {
      kind: "table",
      title: "Foreign-born share of U.S. population (illustrative %)",
      headers: ["Period (end of span)", "Share (%)"],
      rows: [
        ["1980", "6.2"],
        ["1990", "7.9"],
        ["2000", "12.8"],
        ["2010", "13.5"],
      ],
    },
  ),
];

const USH_BY_UNIT: UshQuestionGen[][] = [
  [...USH_U1, ...USH_U1_DYNAMIC],
  [...USH_U2, ...USH_U2_DYNAMIC],
  [...USH_U3, ...USH_U3_DYNAMIC],
  [...USH_U4, ...USH_U4_DYNAMIC],
  [...USH_U5, ...USH_U5_DYNAMIC],
  [...USH_U6, ...USH_U6_DYNAMIC],
  [...USH_U7, ...USH_U7_DYNAMIC],
  [...USH_U8, ...USH_U8_DYNAMIC],
  [...USH_U9, ...USH_U9_DYNAMIC],
];

export function getUsHistoryGeneratorsForUnit(unitIndex: number): UshQuestionGen[] {
  const i = Math.min(9, Math.max(1, Math.floor(unitIndex))) - 1;
  return USH_BY_UNIT[i] ?? USH_BY_UNIT[0];
}
