/**
 * Parametric world history (c. 1200–present) items — stems and distractors vary by RNG
 * so sessions rarely repeat the same question text.
 */
import { whMc, type WhQuestionGen } from "./worldHistoryCore";
import { pick, pickThreeDistinct } from "./utils";

const WRONG_GENERIC_EARLY = [
  "a sudden end to all long-distance trade",
  "the universal adoption of democratic republics",
  "the disappearance of written records in Afro-Eurasia",
  "uniform religious practice within every empire",
  "the end of agriculture in river valleys",
] as const;

const WRONG_MODERN = [
  "a permanent end to interstate conflict",
  "the abolition of all national currencies",
  "complete economic equality within every country",
  "the end of migration across borders",
  "universal adoption of a single world language",
] as const;

function wrong3(rng: () => number, pool: readonly string[], correct: string): [string, string, string] {
  return pickThreeDistinct(rng, [...pool], correct);
}

/* ——— Unit 1 ——— */

export const WH_U1_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const route = pick(rng, [
      "Silk Road networks",
      "Indian Ocean monsoon trade",
      "trans-Saharan commerce",
      "steppe pastoral exchange",
    ]);
    const correct = pick(rng, [
      "diffusion of religions, technologies, and diseases",
      "new opportunities for merchants and urban elites",
      "connections between distant courts and markets",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-trade-${i}`,
      `Around 1200 CE, ${route} are most often cited by historians for enabling which broad pattern?`,
      correct,
      w1,
      w2,
      w3,
      "Interregional exchange reshaped belief, consumption, and political ambition.",
    );
  },
  (rng, ctx, i) => {
    const faith = pick(rng, ["Buddhism", "Islam", "Christianity", "Hinduism"]);
    const correct = pick(rng, [
      "it shaped law, education, gender norms, and political legitimacy in different regions",
      "it provided frameworks for charity, law, and community identity",
      "it intersected with trade, conquest, and local elites",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-rel-${i}`,
      `Which claim best describes how traditions such as ${faith} shaped society and politics around 1200 CE?`,
      correct,
      w1,
      w2,
      w3,
      "Belief systems are analyzed for social and political effects, not only theology.",
    );
  },
  (rng, ctx, i) => {
    const place = pick(rng, ["Baghdad", "Cairo", "Cordoba", "Constantinople"]);
    const correct = pick(rng, [
      "centers of scholarship, commerce, and religious patronage",
      "nodes where manuscripts, goods, and scholars circulated",
      "places where diverse populations negotiated coexistence and conflict",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-city-${i}`,
      `Cities such as ${place} around 1200 CE are often analyzed as examples of`,
      correct,
      w1,
      w2,
      w3,
      "Urban hubs concentrated wealth, learning, and cross-cultural contact.",
    );
  },
  (rng, ctx, i) => {
    const sys = pick(rng, ["European feudal obligations", "Japanese warrior hierarchy", "Byzantine imperial administration"]);
    const correct = pick(rng, [
      "localized political-military ties structured land and loyalty",
      "hierarchies linked elites, cultivators, and specialists",
      "political authority was often fragmented and personal",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-hier-${i}`,
      `A historian comparing ${sys} would most likely emphasize that`,
      correct,
      w1,
      w2,
      w3,
      "Land-based political orders shaped obligation, status, and conflict.",
    );
  },
  (rng, ctx, i) => {
    const emp = pick(rng, ["Song China", "the Abbasid world", "the Delhi Sultanate", "the Khmer world"]);
    const correct = pick(rng, [
      "states combined military power, taxation, and cultural patronage",
      "elites mobilized labor for monumental projects and war",
      "trade revenues and agricultural surplus funded courts and armies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-emp-${i}`,
      `Which generalization best describes ${emp} in the post-classical period (c. 600–c. 1450)?`,
      correct,
      w1,
      w2,
      w3,
      "Land-based states blended coercion, administration, and cultural production.",
    );
  },
  (rng, ctx, i) => {
    const americas = pick(rng, ["Mesoamerican city-states", "Andean labor and road systems", "Mississippian mound centers"]);
    const correct = pick(rng, [
      "dense agriculture, tribute systems, and regional exchange",
      "distinct cosmologies tied to rulership and ritual",
      "environmental and technological adaptations to local geographies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-am-${i}`,
      `Developments such as ${americas} in the Americas are often contrasted with Afro-Eurasia by noting`,
      correct,
      w1,
      w2,
      w3,
      "Scholars compare hemispheres using evidence of states, agriculture, and networks.",
    );
  },
  (rng, ctx, i) => {
    const p = pick(rng, [600, 750, 960, 1050]);
    const correct = pick(rng, [
      "chronology anchors cause-and-effect across regions",
      "periodization highlights change and continuity in trade and states",
      "dates help compare synchronous developments in different societies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-date-${i}`,
      `Why might historians treat ${p} CE as a meaningful reference point for comparison?`,
      correct,
      w1,
      w2,
      w3,
      "Periodization is a tool for comparison, not a neutral fact.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "diffusion, syncretism, and reform movements within traditions",
      "tension between universal claims and local practices",
      "competition among elites to patronize religious institutions",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u1dyn-div-${i}`,
      "Which theme best captures denominational and sectarian diversity inside major world religions c. 1200?",
      correct,
      w1,
      w2,
      w3,
      "Internal diversity is as important as geographic spread.",
    );
  },
];

/* ——— Unit 2 ——— */

export const WH_U2_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const net = pick(rng, ["the Indian Ocean", "the Silk Roads", "Mongol-controlled corridors", "Trans-Saharan routes"]);
    const correct = pick(rng, [
      "accelerated movement of goods, people, faiths, and pathogens",
      "created new opportunities and risks for states and merchants",
      "linked port cities and caravan towns as nodes of exchange",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-net-${i}`,
      `Networks of exchange c. 1200–1450 show that ${net}`,
      correct,
      w1,
      w2,
      w3,
      "Trade integration had demographic and cultural consequences.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "labor scarcity, rising wages, and social unrest in parts of Europe",
      "weakened tax bases and shifting power among elites",
      "accelerated religious explanations and targeted violence against minorities",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-plague-${i}`,
      "The 14th-century bubonic plague pandemic is linked to which broad consequence in Afro-Eurasia?",
      correct,
      w1,
      w2,
      w3,
      "Disease history intersects with labor, faith, and politics.",
    );
  },
  (rng, ctx, i) => {
    const fig = pick(rng, ["Marco Polo", "Ibn Battuta", "Margery Kempe"]);
    const correct = pick(rng, [
      "travel accounts illuminate routes, dangers, and cultural encounters",
      "mobility of people spread ideas alongside commodities",
      "sources must be read critically for exaggeration and audience",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-trav-${i}`,
      `Travel writing about figures such as ${fig} is useful to historians mainly because`,
      correct,
      w1,
      w2,
      w3,
      "Travel narratives are evidence— not transparent truth.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "urban leagues and charters that protected merchant interests",
      "growth of towns as centers of craft and finance",
      "new social groups challenging older noble monopolies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-urban-${i}`,
      "Medieval European trade expansion is associated with",
      correct,
      w1,
      w2,
      w3,
      "Commerce reshaped politics beyond manorial agriculture.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "state-building through cavalry, taxation, and integration of diverse peoples",
      "destructive conquests that also facilitated long-distance movement",
      "successor states adapting Mongol institutions in different regions",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-mongol-${i}`,
      "The Mongol Empire’s historical significance includes",
      correct,
      w1,
      w2,
      w3,
      "Mongol rule combined brutality with connectivity.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "West African gold–salt trade and Islamic scholarly networks",
      "rulers displaying piety and wealth through pilgrimage and patronage",
      "urban centers as sites of learning and commerce",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-mali-${i}`,
      "Accounts of Mali and Songhai in the trans-Saharan world often emphasize",
      correct,
      w1,
      w2,
      w3,
      "Sahelian states linked Sudanic Africa to broader Islamic networks.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "religious motives mixed with political and economic goals",
      "deepened Latin Christian contact (and conflict) with Muslim powers",
      "long-term cultural transfers alongside violence",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-crus-${i}`,
      "The Crusades are best analyzed as",
      correct,
      w1,
      w2,
      w3,
      "Religious war also produced exchange and institutional change.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "universities, law, and debates over faith and reason",
      "attempts to reconcile classical philosophy with theology",
      "institutional Church power over education and orthodoxy",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u2dyn-schol-${i}`,
      "Scholasticism in medieval Europe is associated with",
      correct,
      w1,
      w2,
      w3,
      "Intellectual life was organized through Church institutions.",
    );
  },
];

/* ——— Unit 3 ——— */

export const WH_U3_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "humanism, patronage, and revived interest in classical models",
      "new techniques in art and architecture emphasizing perspective",
      "urban wealth funding courts and cultural competition",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-ren-${i}`,
      "The Italian Renaissance is characterized by",
      correct,
      w1,
      w2,
      w3,
      "Cultural change tracked elite politics and commerce.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "challenges to papal authority and new Protestant churches",
      "print culture spreading debates across Europe",
      "wars and state interventions shaping religious outcomes",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-ref-${i}`,
      "The Protestant Reformation’s effects included",
      correct,
      w1,
      w2,
      w3,
      "Reformation realigned politics, education, and identity.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Janissaries, artillery, and timar land grants",
      "Islamic legitimacy fused with multiethnic rule",
      "rivalry with Safavid Persia and Habsburg Europe",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-otto-${i}`,
      "Ottoman expansion and consolidation relied on",
      correct,
      w1,
      w2,
      w3,
      "Gunpowder empires blended military fiscalism with religious claims.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "administrative integration and revenue from diverse subjects",
      "patronage of art and architecture (e.g., monumental tomb complexes)",
      "tension between central authority and regional elites",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-mugh-${i}`,
      "Mughal rule in South Asia is often evaluated through",
      correct,
      w1,
      w2,
      w3,
      "Mughal history ties taxation, faith policy, and culture.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Manchu military power combined with Confucian bureaucracy",
      "expansion into Taiwan, Tibet, and Inner Asia over time",
      "tensions between ethnic elites and Han society",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-qing-${i}`,
      "The Qing dynasty’s governance is notable for",
      correct,
      w1,
      w2,
      w3,
      "Conquest dynasties negotiated legitimacy across cultures.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "sakoku policies limiting foreign contact and Christianity",
      "samurai-led rule under the Tokugawa shogunate",
      "urban culture and merchant wealth within strict status order",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-toku-${i}`,
      "Tokugawa Japan is associated with",
      correct,
      w1,
      w2,
      w3,
      "Early modern Japan balanced control with economic growth.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "empirical methods challenging older Aristotelian physics in universities",
      "conflict between new cosmologies and religious authorities",
      "institutionalization of science through societies and courts",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-sci-${i}`,
      "The Scientific Revolution is best understood as",
      correct,
      w1,
      w2,
      w3,
      "Science became a contested source of authority.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "absolutism, standing armies, and mercantilist competition",
      "dynastic wars reshaping borders and colonies",
      "state-building through taxation and noble management",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u3dyn-eu-${i}`,
      "European interstate rivalry in the early modern period is driven by",
      correct,
      w1,
      w2,
      w3,
      "Military-fiscal competition defined early modern Europe.",
    );
  },
];

/* ——— Unit 4 ——— */

export const WH_U4_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "biological exchanges that altered diets and demography",
      "coerced labor systems expanding plantation agriculture",
      "silver flows linking Americas to Afro-Eurasian economies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-col-${i}`,
      "The Columbian Exchange is most significant for historians because it produced",
      correct,
      w1,
      w2,
      w3,
      "Atlantic integration remade environments and labor regimes.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Peninsulares and creoles atop hierarchies with indigenous and African labor",
      "encomienda/repartimiento systems extracting labor and tribute",
      "racial categories hardened through law and social practice",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-soc-${i}`,
      "Colonial Latin American societies developed",
      correct,
      w1,
      w2,
      w3,
      "Hierarchy intertwined race, labor, and imperial rule.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "brutal mortality, resistance, and gendered exploitation",
      "creation of African diaspora cultures in the Americas",
      "European states competing for plantation profits",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-slave-${i}`,
      "The trans-Atlantic slave trade is analyzed as",
      correct,
      w1,
      w2,
      w3,
      "Slavery was central to Atlantic capitalism’s expansion.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "joint-stock companies and state-chartered monopolies",
      "naval power protecting trade routes and colonies",
      "bullion imports affecting inflation and state finance",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-merc-${i}`,
      "Mercantilist empires in the early Atlantic era relied on",
      correct,
      w1,
      w2,
      w3,
      "Mercantilism tied colonies to metropolitan wealth.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Iberian crowns dividing claims with papal arbitration",
      "competition among European powers for Atlantic footholds",
      "indigenous polities facing disease and alliance politics",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-iber-${i}`,
      "Early Atlantic colonization is shaped by",
      correct,
      w1,
      w2,
      w3,
      "Empire-building combined law, religion, and violence.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "state-led voyages projecting power across the Indian Ocean",
      "later retrenchment and debates over maritime policy",
      "technological capacity in shipbuilding and navigation",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-zheng-${i}`,
      "Ming maritime expeditions under Zheng He illustrate",
      correct,
      w1,
      w2,
      w3,
      "Chinese states could mobilize oceanic reach before shifting priorities.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "epidemics that devastated populations lacking immunity",
      "alliances and divisions among indigenous states",
      "imperial institutions repurposed under colonial rule",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-conq-${i}`,
      "Spanish and Portuguese conquests in the Americas depended on",
      correct,
      w1,
      w2,
      w3,
      "Conquest combined violence, disease, and local politics.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "new staple crops reshaping labor and land use",
      "price effects linking colonies to European consumers",
      "environmental transformation through plantation agriculture",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u4dyn-cash-${i}`,
      "Cash-crop economies in colonial plantation systems demonstrate",
      correct,
      w1,
      w2,
      w3,
      "Atlantic commodities tied regions through markets and coercion.",
    );
  },
];

/* ——— Unit 5 ——— */

export const WH_U5_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "natural rights, popular sovereignty, and limits on arbitrary rule",
      "social contract ideas influencing constitutions and rebellions",
      "tensions between equality claims and existing hierarchies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-enl-${i}`,
      "Enlightenment political thought contributed to",
      correct,
      w1,
      w2,
      w3,
      "Ideas traveled through salons, print, and empire.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "fiscal crisis, estate inequality, and political deadlock",
      "radicalization producing terror and foreign wars",
      "long-term legal reforms and nationalist mobilization",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-fr-${i}`,
      "The French Revolution escalated because of",
      correct,
      w1,
      w2,
      w3,
      "Revolution combined social grievance with geopolitics.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "slave insurgency defeating French colonial armies",
      "creation of an independent Black-led state in 1804",
      "ideological challenge to racial slavery in the Atlantic",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-haiti-${i}`,
      "The Haitian Revolution’s global significance includes",
      correct,
      w1,
      w2,
      w3,
      "Haiti reframed freedom and citizenship in plantation societies.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "creole elites mobilizing against Iberian rule",
      "ethnic and class divisions shaping post-independence states",
      "foreign intervention and debt limiting sovereignty",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-lat-${i}`,
      "Latin American independence movements featured",
      correct,
      w1,
      w2,
      w3,
      "Independence did not automatically produce equality.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "mechanization, factories, and new energy sources in Britain",
      "enclosure and agricultural productivity feeding industry",
      "urbanization and harsh working conditions provoking reform",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-ind-${i}`,
      "Industrialization in Britain is explained by historians through",
      correct,
      w1,
      w2,
      w3,
      "Industrial change was regional and contested.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "class-based appeals and fears of worker organization",
      "utopian and Marxist critiques of industrial capitalism",
      "state responses ranging from repression to limited reform",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-soc-${i}`,
      "Socialism and labor movements in the 19th century reflected",
      correct,
      w1,
      w2,
      w3,
      "Industrial society generated new identities and politics.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "language, folklore, and education as nation-building tools",
      "conflicts over borders and minority rights",
      "linkage between mass politics and imperial competition",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-nat-${i}`,
      "Nationalism in the 19th century is associated with",
      correct,
      w1,
      w2,
      w3,
      "Nationalism could unify or exclude populations.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "demands for suffrage, education, and legal equality",
      "tensions between reformist and radical strategies",
      "intersection with abolitionism and labor organizing",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_GENERIC_EARLY, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u5dyn-wom-${i}`,
      "Women’s rights movements in the long nineteenth century emphasized",
      correct,
      w1,
      w2,
      w3,
      "Gendered citizenship was contested alongside class and race.",
    );
  },
];

/* ——— Unit 6 ——— */

export const WH_U6_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "racist pseudoscience and ‘civilizing mission’ ideology",
      "economic motives for raw materials and markets",
      "strategic competition among industrial powers",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-imp-${i}`,
      "New imperialism is driven by",
      correct,
      w1,
      w2,
      w3,
      "Empire mixed extraction with cultural claims.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "direct Crown rule after 1857 and tighter integration",
      "Indian National Congress and later mass nationalism",
      "economic restructuring benefiting British industry",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-india-${i}`,
      "British India after the Sepoy Rebellion is characterized by",
      correct,
      w1,
      w2,
      w3,
      "Colonial rule provoked organized resistance.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "unequal treaties, treaty ports, and extraterritoriality",
      "peasant rebellions and elite reform movements",
      "foreign spheres of influence weakening Qing autonomy",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-china-${i}`,
      "Qing China’s 19th-century crises included",
      correct,
      w1,
      w2,
      w3,
      "Semi-colonial pressures reshaped Chinese politics.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "European claims negotiated with little African consent",
      "arbitrary borders dividing peoples and resources",
      "violent conquest and African diplomatic resistance",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-berlin-${i}`,
      "The Berlin Conference system is significant because it",
      correct,
      w1,
      w2,
      w3,
      "Partition accelerated formal empire in Africa.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "state-led industrialization and military modernization",
      "abolition of samurai privileges and land-tax reform",
      "imperial expansion in Korea and rivalry with China",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-meiji-${i}`,
      "Meiji Japan’s reforms aimed at",
      correct,
      w1,
      w2,
      w3,
      "Japan’s rise altered Asian power balances.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "railroads and extractive infrastructure for exports",
      "displacement of peasants and new labor regimes",
      "environmental damage from mining and plantation agriculture",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-res-${i}`,
      "Colonial economies in Africa and Asia often featured",
      correct,
      w1,
      w2,
      w3,
      "Integration into global markets had local costs.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "factory acts limiting child labor and hours in industrial states",
      "labor unions bargaining for wages and safety",
      "tensions between laissez-faire ideology and reform",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-lab-${i}`,
      "Industrial reform in the long 19th century included",
      correct,
      w1,
      w2,
      w3,
      "Workers contested exploitation through law and strikes.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "competition for railway concessions and loans",
      "nationalist reactions to foreign privilege",
      "foreign banks and advisors influencing policy",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u6dyn-fin-${i}`,
      "Financial imperialism in Latin America and Asia involved",
      correct,
      w1,
      w2,
      w3,
      "Debt and investment could constrain sovereignty.",
    );
  },
];

/* ——— Unit 7 ——— */

export const WH_U7_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "entangling alliances and military mobilization plans",
      "nationalist tensions in the Balkans",
      "industrialized warfare and trench stalemate",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-ww1-${i}`,
      "World War I’s causes include",
      correct,
      w1,
      w2,
      w3,
      "WWI combined diplomacy failures with mass armies.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "war guilt clause, reparations, and territorial losses for Germany",
      "mandate system formalizing Allied control in parts of the Middle East and Africa",
      "League of Nations created with limited enforcement",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-vers-${i}`,
      "The Treaty of Versailles is criticized historically for",
      correct,
      w1,
      w2,
      w3,
      "Peace terms fed resentment and instability.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Bolshevik seizure of power and exit from WWI",
      "civil war, famine, and Red Army consolidation",
      "ideological challenge to liberal capitalism",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-rus-${i}`,
      "The Russian Revolution produced",
      correct,
      w1,
      w2,
      w3,
      "Revolution exported a communist model globally.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "credit collapse, unemployment, and protectionism",
      "political radicalization in many democracies",
      "colonial economies hurt by falling commodity prices",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-dep-${i}`,
      "The Great Depression spread worldwide because of",
      correct,
      w1,
      w2,
      w3,
      "Economic crisis was globally interconnected.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "ultranationalism, militarism, and racial ideology",
      "corporatist states mobilizing economies for war",
      "aggressive expansion leading to WWII",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-fasc-${i}`,
      "Interwar fascism is characterized by",
      correct,
      w1,
      w2,
      w3,
      "Fascism rejected liberal democracy and targeted minorities.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "industrialized mass murder and ghettoization",
      "collaboration and resistance across occupied Europe",
      "postwar trials and memory politics",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-holo-${i}`,
      "The Holocaust as historical analysis emphasizes",
      correct,
      w1,
      w2,
      w3,
      "Genocide was central to Nazi racial war.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "US mobilization and production superiority",
      "Soviet sacrifice on the Eastern Front",
      "Allied strategic bombing and combined operations",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-ww2-${i}`,
      "Allied victory in WWII depended on",
      correct,
      w1,
      w2,
      w3,
      "Total war mobilized entire societies.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Bretton Woods institutions framing postwar money and trade",
      "decolonization pressures and superpower competition",
      "nuclear weapons transforming deterrence",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u7dyn-post-${i}`,
      "Post-1945 global order formation included",
      correct,
      w1,
      w2,
      w3,
      "Institutions attempted stability amid empire’s end.",
    );
  },
];

/* ——— Unit 8 ——— */

export const WH_U8_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "US aid to resist communist movements in Greece and Turkey",
      "a broader strategy of containing Soviet influence",
      "tension between intervention and local sovereignty",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-tru-${i}`,
      "The Truman Doctrine signaled",
      correct,
      w1,
      w2,
      w3,
      "Containment framed US Cold War policy.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "competing military blocs in Europe",
      "proxy wars in Asia, Africa, and Latin America",
      "nuclear arms races and crises",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-cw-${i}`,
      "The Cold War’s global dimensions included",
      correct,
      w1,
      w2,
      w3,
      "Superpower rivalry reshaped third-world politics.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "partition violence and competing nationalisms",
      "different visions of secularism and minority rights",
      "long-term conflict over Kashmir and borders",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-indpart-${i}`,
      "Indian independence and partition illustrate",
      correct,
      w1,
      w2,
      w3,
      "Decolonization could produce mass displacement.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "CCP victory after civil war and Japanese invasion",
      "land reform and party mobilization among peasants",
      "alignment then split with the Soviet Union",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-ccp-${i}`,
      "The Chinese Communist rise to power involved",
      correct,
      w1,
      w2,
      w3,
      "Revolution combined social revolution with nationalism.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "limited war and armistice along the 38th parallel",
      "Chinese intervention and high casualties",
      "US-led UN coalition under Cold War logic",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-kor-${i}`,
      "The Korean War is best described as",
      correct,
      w1,
      w2,
      w3,
      "Korea exemplified early Cold War hot wars.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "US escalation and inability to defeat guerrilla strategy",
      "massive bombing and rural devastation",
      "Vietnamese nationalism framed as communist threat",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-vn-${i}`,
      "The Vietnam War shows that",
      correct,
      w1,
      w2,
      w3,
      "Military superiority did not guarantee political victory.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "apartheid laws and forced removals",
      "ANC resistance, sanctions, and international pressure",
      "negotiated transition and truth-and-reconciliation debates",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-za-${i}`,
      "South African apartheid ended through",
      correct,
      w1,
      w2,
      w3,
      "Domestic struggle met global anti-apartheid campaigns.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "Gorbachev reforms loosening party control",
      "national independence movements in Eastern Europe",
      "economic stagnation and military overstretch",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u8dyn-ussr-${i}`,
      "The Soviet Union collapsed due to",
      correct,
      w1,
      w2,
      w3,
      "Empire unraveled quickly once coercion faltered.",
    );
  },
];

/* ——— Unit 9 ——— */

export const WH_U9_DYNAMIC: WhQuestionGen[] = [
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "trade rules, dispute settlement, and tariff negotiations",
      "tension between free trade and domestic protection",
      "uneven benefits across developed and developing economies",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-wto-${i}`,
      "The WTO’s role in globalization includes",
      correct,
      w1,
      w2,
      w3,
      "Institutions structure—but do not eliminate—conflict over trade.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "deepening supply chains alongside regional trade blocs",
      "English as a lingua franca in business and science",
      "cultural hybridity and backlash against migration",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-cult-${i}`,
      "Contemporary globalization is marked by",
      correct,
      w1,
      w2,
      w3,
      "Culture and labor move as well as capital.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "transnational terror networks and asymmetric attacks",
      "US-led wars in Afghanistan and Iraq reshaping Middle East politics",
      "tensions between security policy and civil liberties",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-terr-${i}`,
      "Post-2001 security debates focus on",
      correct,
      w1,
      w2,
      w3,
      "9/11 accelerated global counterterror frameworks.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "export manufacturing and special economic zones",
      "state capitalism and infrastructure investment",
      "environmental costs and geopolitical rivalry with the US",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-cn-${i}`,
      "China’s rise as a global economy involves",
      correct,
      w1,
      w2,
      w3,
      "Development paths combined markets with party control.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "service exports and tech-sector integration",
      "demographic dividend and persistent inequality",
      "strategic partnerships with multiple great powers",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-in-${i}`,
      "India’s globalization story includes",
      correct,
      w1,
      w2,
      w3,
      "India illustrates late-developer growth with internal diversity.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "climate negotiations burden-sharing and technology transfer",
      "biodiversity loss and ocean acidification",
      "local activism linking environment to justice",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-env-${i}`,
      "Global environmental politics centers on",
      correct,
      w1,
      w2,
      w3,
      "Environmental issues are politically and economically contested.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "unequal vaccine access during pandemics",
      "WHO coordination limits versus state sovereignty",
      "economic shocks disrupting trade and migration",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-health-${i}`,
      "Global health governance highlights",
      correct,
      w1,
      w2,
      w3,
      "Health crises expose inequality between countries.",
    );
  },
  (rng, ctx, i) => {
    const correct = pick(rng, [
      "rapid information spread and algorithmic amplification",
      "state surveillance and censorship debates",
      "new social movements organized online",
    ]);
    const [w1, w2, w3] = wrong3(rng, WRONG_MODERN, correct);
    return whMc(
      rng,
      ctx,
      i,
      `u9dyn-net-${i}`,
      "Digital technology in the early twenty-first century matters because it enables",
      correct,
      w1,
      w2,
      w3,
      "The internet reshapes politics, economy, and privacy.",
    );
  },
];
