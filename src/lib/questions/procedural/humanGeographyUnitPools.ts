import { geoItem, type GeoQuestionGen } from "./humanGeographyCore";
import {
  HG_U1_DYNAMIC,
  HG_U2_DYNAMIC,
  HG_U3_DYNAMIC,
  HG_U4_DYNAMIC,
  HG_U5_DYNAMIC,
  HG_U6_DYNAMIC,
  HG_U7_DYNAMIC,
} from "./humanGeographyDynamicPools";

/* ——— Unit 1: Thinking Geographically ——— */

const HG_U1: GeoQuestionGen[] = [
  geoItem(
    "u1-space",
    "In human geography, “space” often refers to",
    "the geographic surface on which locations, distances, and patterns are analyzed",
    ["only empty wilderness with no human activity", "only national capitals", "only lines of latitude"],
    "Space is the geographic canvas for distance, direction, and arrangement.",
  ),
  geoItem(
    "u1-place",
    "A “place” differs from bare space mainly because place emphasizes",
    "human meaning, identity, and interpreted attributes attached to a location",
    ["only raw coordinates with no interpretation", "only ocean depths", "only digital map tiles"],
    "Place ties location to culture, economy, and experience.",
  ),
  geoItem(
    "u1-scale",
    "Relative scale (scale of analysis) refers to",
    "the level at which data are grouped and examined, from local to global",
    ["the ratio on a bar scale graphic only", "only the size of map paper", "only elevation contour spacing"],
    "Changing scale changes what patterns appear and what is aggregated.",
  ),
  geoItem(
    "u1-formal",
    "A formal region is best defined as an area that",
    "shares one or more measurable or mappable uniform traits",
    ["is defined only by rumor with no shared traits", "must be centered on a single highway interchange", "cannot appear on any thematic map"],
    "Formal regions emphasize internal similarity for a chosen characteristic.",
  ),
  geoItem(
    "u1-functional",
    "A functional (nodal) region is organized around",
    "a focal point and the flows (people, goods, information) that tie the area to it",
    ["perfectly uniform soil chemistry everywhere", "only parallel lines of longitude", "random noise with no connections"],
    "Functional regions emphasize organization around a node and interactions.",
  ),
  geoItem(
    "u1-tobler",
    "Tobler’s first law of geography is often summarized as stating that",
    "near things are more related than distant things",
    ["distant places always interact more than nearby ones", "distance is irrelevant to similarity", "all maps must use equal-area projections"],
    "It foregrounds distance decay and spatial autocorrelation ideas.",
  ),
  geoItem(
    "u1-ecotone",
    "An ecotone is",
    "a transitional zone where two ecosystems meet and blend",
    ["a type of formal economic union", "a straight border between time zones", "a map projection centered on the poles"],
    "Ecotones mark gradual environmental change, not always sharp lines.",
  ),
  geoItem(
    "u1-fig-scale",
    "According to the bar chart, which map scale represents the smaller area on the ground (more detailed mapping)?",
    "1:50,000",
    ["1:500,000", "1:1,000,000", "1:5,000,000"],
    "For representative fractions 1:x, a larger x means each map unit covers more ground (smaller-scale map, less detail). 1:50,000 is larger-scale than 1:1,000,000 and shows a smaller ground area.",
    {
      kind: "bar_chart",
      title: "Representative fraction — area on ground covered (conceptual)",
      yLabel: "Relative area covered (smaller = more zoomed in)",
      bars: [
        { label: "1:50,000", value: 8 },
        { label: "1:500,000", value: 35 },
        { label: "1:1,000,000", value: 55 },
        { label: "1:5,000,000", value: 90 },
      ],
    },
  ),
];

/* ——— Unit 2: Population and Migration ——— */

const HG_U2: GeoQuestionGen[] = [
  geoItem(
    "u2-cbr",
    "The crude birth rate (CBR) is typically expressed as",
    "live births per 1,000 people in a year",
    ["births per square kilometer of desert", "births per farm only", "percent of elderly population"],
    "Crude rates relate events to total population in a standard way.",
  ),
  geoItem(
    "u2-rni",
    "The rate of natural increase (RNI) is derived from",
    "birth and death rates (and is usually expressed per year as a percent-like figure from those rates)",
    ["immigration minus exports", "total GDP divided by farmland", "average building height in cities"],
    "Natural increase excludes net migration; it focuses on vital events.",
  ),
  geoItem(
    "u2-tfr",
    "Replacement-level fertility is often cited near",
    "2.1 children per woman over a lifetime (context-dependent)",
    ["0.5 children per woman", "10 children per woman", "exactly 1.0 in every country without exception"],
    "Replacement must offset mortality; ~2.1 is a common rule-of-thumb in low-mortality settings.",
  ),
  geoItem(
    "u2-malthus",
    "Neo-Malthusian concerns in population–resource debates emphasize that",
    "demand for food and resources may outpace sustainable supply if consumption and population pressures grow",
    ["resource limits are impossible in any scenario", "technology automatically removes all scarcity forever", "population cannot affect environments"],
    "Neo-Malthusians stress limits and sustainability, not only absolute food arithmetic.",
  ),
  geoItem(
    "u2-step",
    "Step migration typically describes",
    "a series of moves to progressively larger or more advantageous places",
    ["random teleportation with no origin", "only movement within one building", "seasonal vacation travel only"],
    "Migration often proceeds in stages up an urban or opportunity hierarchy.",
  ),
  geoItem(
    "u2-intervene",
    "An intervening opportunity affects movement because",
    "a closer alternative satisfies the goal, reducing the draw of a farther destination",
    ["it always increases distance decay to zero", "it eliminates all migration statistics", "it only affects air quality indexes"],
    "Closer substitutes can short-circuit longer trips.",
  ),
  geoItem(
    "u2-fig-pop",
    "According to the bar chart, which age group has the largest share of males in this stylized pyramid slice?",
    "0–4",
    ["60–64", "40–44", "20–24"],
    "Compare bar lengths for males on the left for each cohort.",
    {
      kind: "bar_chart",
      title: "Population by age cohort — males (thousands, sample)",
      yLabel: "Thousands",
      bars: [
        { label: "0–4", value: 420 },
        { label: "20–24", value: 380 },
        { label: "40–44", value: 310 },
        { label: "60–64", value: 260 },
      ],
    },
  ),
];

/* ——— Unit 3: Cultural Patterns ——— */

const HG_U3: GeoQuestionGen[] = [
  geoItem(
    "u3-sync",
    "Cultural syncretism refers to",
    "the blending of traits from two or more cultural sources into new forms",
    ["complete erasure of all local traditions overnight", "a law forbidding translation", "identical landscapes in every biome"],
    "Syncretism is common in music, religion, food, and language contact zones.",
  ),
  geoItem(
    "u3-lingua",
    "A lingua franca is",
    "a bridge language used by speakers of different native languages",
    ["a language only written, never spoken", "a secret code with no geographic spread", "the smallest language family possible"],
    "English often functions as a global lingua franca today in business and media.",
  ),
  geoItem(
    "u3-folkvpop",
    "Compared with folk culture, popular culture is more likely to be",
    "mass-produced, widely distributed, and rapidly changing",
    ["hyper-local and transmitted only orally for centuries with no diffusion", "limited to one watershed", "immune to media"],
    "Popular culture spreads via corporations, stars, and digital networks.",
  ),
  geoItem(
    "u3-sequent",
    "Sequent occupance helps geographers see that",
    "successive groups leave layered imprints on a place’s cultural landscape over time",
    ["history leaves no physical traces", "only one culture can ever occupy a place", "borders never change"],
    "Layers include architecture, toponyms, and land division.",
  ),
  geoItem(
    "u3-relig",
    "A universalizing religion is characterized by",
    "openness to conversion and teaching aimed at diverse peoples",
    ["strict hereditary membership only with no converts", "being confined to one village forever", "rejecting all sacred texts"],
    "Universalizing faiths spread on multiple continents through mission and trade.",
  ),
  geoItem(
    "u3-poss",
    "Possibilism in cultural–environment relationships stresses that",
    "human choices and technology mediate environmental constraints",
    ["culture is rigidly predetermined by climate with no agency", "maps cannot show culture", "soil type alone dictates every political system"],
    "Possibilism reacted against rigid environmental determinism.",
  ),
  geoItem(
    "u3-ethno",
    "Ethnicity in geography is commonly analyzed as",
    "a socially constructed identity tied to ancestry, culture, and politics",
    ["only individual fingerprint patterns", "only annual rainfall totals", "only longitude lines"],
    "Ethnicity is contested, performed, and spatially patterned.",
  ),
];

/* ——— Unit 4: Political Patterns ——— */

const HG_U4: GeoQuestionGen[] = [
  geoItem(
    "u4-nation-state",
    "A nation-state (in principle) combines",
    "a broad alignment of national identity with a sovereign government over a territory",
    ["a city government without any territory", "only a sports league", "a company charter"],
    "Real states often house multiple nations; pure nation-states are rare.",
  ),
  geoItem(
    "u4-enclave",
    "An enclave is",
    "territory of one political unit surrounded by another’s territory",
    ["any coastal port", "a capital district always shaped as a circle", "ocean water beyond EEZs"],
    "Enclaves raise questions of access, identity, and governance.",
  ),
  geoItem(
    "u4-exclave",
    "An exclave is",
    "a portion of a state’s territory separated from the main part by another state’s land",
    ["the capital’s downtown only", "any island with no people", "only Antarctica"],
    "Alaska (U.S.) separated by Canada is a classic example.",
  ),
  geoItem(
    "u4-devolution",
    "Devolution refers to",
    "transferring power from a central government to regional or local authorities",
    ["complete elimination of all borders worldwide", "mandatory unitary rule with zero local input", "ocean currents only"],
    "Devolution responds to regional demands and can reduce centrifugal tension—or fuel it.",
  ),
  geoItem(
    "u4-gerry",
    "Gerrymandering attempts to influence",
    "electoral outcomes by shaping district boundaries",
    ["tidal ranges in estuaries", "the height of mountain peaks", "plate tectonics"],
    "Packing and cracking are common strategies.",
  ),
  geoItem(
    "u4-eez",
    "Under widely used UNCLOS ideas, a coastal state’s exclusive economic zone (EEZ) typically extends to about",
    "200 nautical miles from baseline coastlines (with complexities near islands and disputes)",
    ["12 nautical miles total for all resources", "1 mile", "unlimited distance worldwide"],
    "EEZ focuses on resource rights; territorial sea rules differ (often 12 nm).",
  ),
  geoItem(
    "u4-centri",
    "Centrifugal forces in political geography are forces that",
    "threaten to weaken or break apart a state’s unity",
    ["always strengthen national holidays", "guarantee identical incomes", "only affect weather, not politics"],
    "Ethnic conflict, inequality, and separatism are examples.",
  ),
];

/* ——— Unit 5: Agriculture ——— */

const HG_U5: GeoQuestionGen[] = [
  geoItem(
    "u5-intext",
    "Intensive agriculture is characterized by",
    "high inputs of labor and/or capital per unit of land",
    ["zero labor on infinite land with no outputs", "only hunting with no crops", "only ocean fishing"],
    "Intensity contrasts with extensive systems spread thinly over large areas.",
  ),
  geoItem(
    "u5-arith",
    "Arithmetic population density is",
    "people per unit of total land area",
    ["farmers per unit of church floor space", "people per unit of arable land only", "crops per language"],
    "Physiologic density uses arable land in the denominator instead.",
  ),
  geoItem(
    "u5-swash",
    "Shifting cultivation in tropical forests is often criticized environmentally when",
    "fallow periods shorten and population pressure prevents forest recovery",
    ["it is practiced with centuries-long fallow in stable population conditions", "no trees are ever cut", "only hydroponics are used"],
    "Sustainability depends on rotation length and population pressure.",
  ),
  geoItem(
    "u5-col",
    "The Columbian Exchange refers especially to",
    "the widespread transfer of crops, animals, and diseases between the hemispheres after contact",
    ["only the spread of paper money in Asia", "only railroad timetables in Europe", "only Antarctic exploration"],
    "It reshaped diets, labor systems, and demography globally.",
  ),
  geoItem(
    "u5-commod",
    "A commodity chain in agriculture traces",
    "inputs, production, processing, distribution, and consumption links",
    ["only rainfall in one field", "only national anthem lyrics", "only map legends"],
    "Chains reveal who captures value along the route.",
  ),
  geoItem(
    "u5-von",
    "In Von Thünen’s isolated state model, land use rings are driven largely by",
    "transport costs and land rent relative to a central market town",
    ["random tribal taboos only", "solely the color of soils with no economics", "only national flag design"],
    "Perishable or bulky products locate nearer the center in the classic teaching model.",
  ),
  geoItem(
    "u5-fig-crop",
    "According to the table, which crop had the highest production in Year 2?",
    "Soybeans",
    ["Wheat", "Rice", "Sorghum"],
    "Scan the Year 2 column for the largest number.",
    {
      kind: "table",
      title: "Crop production (million metric tons) — sample",
      headers: ["Crop", "Year 1", "Year 2"],
      rows: [
        ["Wheat", "22", "24"],
        ["Rice", "18", "19"],
        ["Soybeans", "31", "44"],
        ["Sorghum", "9", "10"],
      ],
    },
  ),
];

/* ——— Unit 6: Cities ——— */

const HG_U6: GeoQuestionGen[] = [
  geoItem(
    "u6-cbd",
    "The central business district (CBD) of a city is typically characterized by",
    "high land values, intensive land use, and strong accessibility",
    ["the lowest population density in the entire metro area always", "only single-family farms", "only national parks"],
    "Bid-rent theory explains competition for accessible central land.",
  ),
  geoItem(
    "u6-burgess",
    "Burgess’s concentric zone model highlights",
    "ring-like expansion outward from a CBD under industrial-era assumptions",
    ["strict sectors only with no rings", "multiple equal downtowns from day one", "only medieval walls"],
    "It is an idealization of early 20th-century North American patterns.",
  ),
  geoItem(
    "u6-hoyt",
    "The sector model differs from concentric rings mainly by emphasizing",
    "wedge-shaped corridors along transport routes and social differentiation",
    ["perfect circles only", "no roads", "random scatter with no CBD"],
    "Sectors capture directional growth along rail or arterial roads.",
  ),
  geoItem(
    "u6-edge",
    "An edge city typically features",
    "large office and retail clusters on the suburban periphery with strong daytime activity",
    ["only subsistence farming", "a medieval cathedral as the only building", "oceanic trenches"],
    "Edge cities decentralize economic gravity from older downtowns.",
  ),
  geoItem(
    "u6-gentr",
    "Gentrification often leads to",
    "rising property values and displacement pressures on lower-income residents",
    ["automatic increases in industrial smokestack density", "complete abandonment of services", "mandatory rural residency"],
    "Reinvestment can renew neighborhoods but redistribute costs and benefits unevenly.",
  ),
  geoItem(
    "u6-primate",
    "Urban primacy describes a situation where",
    "the largest city is disproportionately dominant relative to the next cities in the hierarchy",
    ["all cities are exactly equal size", "only villages exist", "capital cities are always tiny"],
    "Primacy can concentrate infrastructure and political attention.",
  ),
  geoItem(
    "u6-fig-urban",
    "According to the line chart, during which interval was the metro population growth rate highest?",
    "2010–2015",
    ["2000–2005", "2005–2010", "2015–2020"],
    "Pick the steepest upward segment on the line.",
    {
      kind: "line_chart",
      title: "Metro population growth rate (% per period)",
      yLabel: "% change",
      points: [
        { x: "2000–2005", y: 0.9 },
        { x: "2005–2010", y: 1.2 },
        { x: "2010–2015", y: 2.4 },
        { x: "2015–2020", y: 1.6 },
      ],
    },
  ),
];

/* ——— Unit 7: Industry and Economic Development ——— */

const HG_U7: GeoQuestionGen[] = [
  geoItem(
    "u7-deind",
    "Deindustrialization in many high-income countries involved",
    "a declining share of employment and output in manufacturing relative to services",
    ["the end of all factories on Earth", "zero service jobs", "complete elimination of trade"],
    "Jobs moved offshore or automated; services rose as a share of GDP.",
  ),
  geoItem(
    "u7-fdi",
    "Foreign direct investment (FDI) typically means",
    "lasting ownership stakes in enterprises abroad, such as building or buying facilities",
    ["a tourist buying souvenirs only", "a one-time cash gift with no assets", "only domestic bank savings"],
    "FDI links firms and places across borders.",
  ),
  geoItem(
    "u7-weber",
    "Weber’s industrial location thinking stresses",
    "minimizing transport and other location costs for inputs and outputs",
    ["random plant placement with no costs", "only astrological charts", "only river names"],
    "Weight-gaining vs weight-losing processes matter for siting.",
  ),
  geoItem(
    "u7-waller",
    "In Wallerstein’s world-systems perspective, peripheral regions are often characterized by",
    "export of low-wage labor and raw materials with weaker bargaining power",
    ["automatic control of global finance", "guaranteed highest wages on Earth", "no trade links"],
    "Core–semi-periphery–periphery relations are relational and contested.",
  ),
  geoItem(
    "u7-hdi",
    "The Human Development Index (HDI) combines indicators such as",
    "health, education, and standard of living proxies into a composite score",
    ["only total number of airports", "only national anthem length", "only mineral purity"],
    "HDI aims to broaden development beyond GDP alone.",
  ),
  geoItem(
    "u7-agglom",
    "Agglomeration economies arise when",
    "firms benefit from locating near suppliers, workers, and knowledge spillovers",
    ["every firm isolates on a separate continent", "transport costs are infinite", "labor never moves"],
    "Clusters can raise productivity but also congestion and rents.",
  ),
  geoItem(
    "u7-break",
    "A break-of-bulk point is a location where",
    "goods switch transport mode (e.g., ship to rail), often generating warehousing and jobs",
    ["all manufacturing must stop forever", "only deserts exist", "time zones are abolished"],
    "Ports and fall-line cities often illustrate this function.",
  ),
];

const HG_BY_UNIT: GeoQuestionGen[][] = [
  [...HG_U1, ...HG_U1_DYNAMIC],
  [...HG_U2, ...HG_U2_DYNAMIC],
  [...HG_U3, ...HG_U3_DYNAMIC],
  [...HG_U4, ...HG_U4_DYNAMIC],
  [...HG_U5, ...HG_U5_DYNAMIC],
  [...HG_U6, ...HG_U6_DYNAMIC],
  [...HG_U7, ...HG_U7_DYNAMIC],
];

export function getHumanGeographyGeneratorsForUnit(unitIndex: number): GeoQuestionGen[] {
  const i = Math.min(7, Math.max(1, Math.floor(unitIndex))) - 1;
  return HG_BY_UNIT[i] ?? HG_BY_UNIT[0];
}
