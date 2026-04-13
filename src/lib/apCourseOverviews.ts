import { AP_COURSES } from "./apCatalog";

/**
 * Concise course overviews for AP subjects. Shown in the dashboard / AP practice
 * "Course overview" panel (see ApCourseUnitList).
 */
export type CourseOverviewSection = {
  title: string;
  body: string;
};

export type CourseOverview = {
  /** Short label for the panel heading */
  eyebrow: string;
  /** One-line summary under the course title when overview is open */
  summary: string;
  sections: CourseOverviewSection[];
};

export const AP_COURSE_OVERVIEWS: Record<string, CourseOverview> = {
  "calc-ab": {
    eyebrow: "AP Calculus AB",
    summary:
      "Differential and integral calculus of functions of one variable, with applications and an introduction to differential equations—aligned with first-semester college calculus.",
    sections: [
      {
        title: "What you learn",
        body:
          "Limits, continuity, derivatives and their meaning in context, analytical and applied uses of differentiation, definite and indefinite integrals, accumulation, separable differential equations, and applications of integration.",
      },
      {
        title: "How the AP exam is built",
        body:
          "The exam mixes calculator-eligible and no-calculator sections across multiple choice and free response. You must show clear reasoning, correct notation, and setup for applied problems.",
      },
      {
        title: "How practice maps here",
        body:
          "Units track the usual AB sequence from limits through integration and simple differential equations. Pick a unit to keep generated multiple-choice practice focused on that chapter of the course.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Connect graphical, numerical, and algebraic views; justify conclusions; interpret rates of change and net change; and check units and reasonableness in applied settings.",
      },
    ],
  },
  "calc-bc": {
    eyebrow: "AP Calculus BC",
    summary:
      "All AB topics plus advanced integration techniques, parametric, polar, and vector-valued functions, and infinite sequences and series—roughly two semesters of calculus.",
    sections: [
      {
        title: "What you learn",
        body:
          "Everything in AB, plus advanced integration, parametric and polar motion, vector-valued functions, convergence tests, power series, Taylor series, and error bounds where appropriate.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response include BC-only content with careful attention to series convergence and communication of reasoning. Some tasks are no-calculator.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow the AB core first, then add parametric/polar/vector material and sequences and series. Choose a unit to drill that slice of the syllabus.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Move fluently between representations, justify series conclusions, and manage time on longer free-response stems.",
      },
    ],
  },
  precalc: {
    eyebrow: "AP Precalculus",
    summary:
      "A rigorous preparation course: functions, modeling, trigonometry, polar and parametric graphs, vectors, matrices, sequences, and an introduction to limits and calculus ideas.",
    sections: [
      {
        title: "What you learn",
        body:
          "You build fluency with polynomial, rational, exponential, logarithmic, and trigonometric functions; represent data and contexts with models; and use vectors, matrices, and complex numbers where relevant.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Expect multiple choice plus free-response tasks that probe conceptual understanding, procedural skill, and communication with graphs and symbols.",
      },
      {
        title: "How practice maps here",
        body:
          "Units move from polynomial and rational functions through exponentials, logs, trig, parameters, vectors, conics, sequences, and modeling. Select a unit to target one strand.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Translate between contexts and equations, choose appropriate models, and verify solutions against constraints.",
      },
    ],
  },
  stats: {
    eyebrow: "AP Statistics",
    summary:
      "Collecting and describing data, probability, inference for proportions and means, chi-square, and slopes—emphasizing design, variability, and justified conclusions.",
    sections: [
      {
        title: "What you learn",
        body:
          "Exploratory analysis, study design, probability and random variables, sampling distributions, confidence intervals and tests for proportions and means, chi-square inference, and inference for slopes.",
      },
      {
        title: "How the AP exam is built",
        body:
          "The exam is largely investigative: multiple choice plus substantial free response where you interpret output, justify conditions, and write conclusions in context.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow the usual flow from one-variable data through design, probability, sampling distributions, and inference topics. Pick a unit to concentrate practice there.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Always tie conclusions to the question asked, name the correct inferential procedure, check conditions, and interpret in plain language.",
      },
    ],
  },
  "cs-a": {
    eyebrow: "AP Computer Science A",
    summary:
      "Object-oriented programming in Java: design, implementation, and analysis of algorithms and data structures at a first-year college level.",
    sections: [
      {
        title: "What you learn",
        body:
          "Types, control flow, arrays and ArrayList, writing and using classes, inheritance, polymorphism, searching and sorting, and recursion—using the AP Java subset.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice plus free response where you trace code, complete methods, and implement small programs by hand under time pressure.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with objects, control structures, arrays, classes, lists, inheritance, and recursion. Choose a unit to drill that part of the curriculum.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Read specifications carefully, preserve invariants, test edge cases, and express design with clear class responsibilities.",
      },
    ],
  },
  csp: {
    eyebrow: "AP Computer Science Principles",
    summary:
      "Big ideas in computing: creativity, data, algorithms, programming, systems, networks, and the impact of computing on society.",
    sections: [
      {
        title: "What you learn",
        body:
          "You connect computing concepts to real problems, interpret data, explain how hardware and software cooperate, and reason about benefits, risks, and tradeoffs of technology.",
      },
      {
        title: "How the AP exam is built",
        body:
          "In addition to the end-of-course exam, the course includes through-year performance tasks (Create and Explore-style work in most programs). Check your teacher for current requirements.",
      },
      {
        title: "How practice maps here",
        body:
          "Units span creative development, data, algorithms and programming, systems and networks, impact, and investigative practices. Pick a unit for focused multiple-choice review.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Explain ideas in plain language, connect abstractions to examples, and think about equity, security, and privacy.",
      },
    ],
  },
  "physics-1": {
    eyebrow: "AP Physics 1",
    summary:
      "Algebra-based introductory physics: mechanics, simple harmonic motion, basic electricity, and mechanical waves—emphasizing conceptual models and lab reasoning.",
    sections: [
      {
        title: "What you learn",
        body:
          "Kinematics, forces, energy, momentum, rotation and torque, oscillations, electric charge and circuits, and waves—using algebra and trigonometry, not calculus.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response include experimental design and qualitative/quantitative reasoning; some questions are multi-step and strongly conceptual.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow mechanics through rotation, then electricity and waves. Select a unit to keep drills inside that topic cluster.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Draw clear diagrams, choose systems wisely, justify claims from evidence, and watch unit consistency.",
      },
    ],
  },
  "physics-2": {
    eyebrow: "AP Physics 2",
    summary:
      "Second-semester algebra-based physics: fluids, thermodynamics, electromagnetism, optics, and introductory quantum and nuclear topics.",
    sections: [
      {
        title: "What you learn",
        body:
          "Fluids and thermal physics, electric fields and circuits, magnetism and induction, light and optics, and selected modern physics ideas.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response emphasize conceptual explanation, experimental reasoning, and multi-representation problem solving.",
      },
      {
        title: "How practice maps here",
        body:
          "Units are grouped by fluids, thermo, E&M, optics, and modern physics. Pick a unit to focus practice on one domain.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Link phenomena to principles, use ray and field diagrams where helpful, and explain limiting cases.",
      },
    ],
  },
  "physics-c-m": {
    eyebrow: "AP Physics C: Mechanics",
    summary:
      "Calculus-based mechanics for physical science and engineering-bound students: motion, forces, energy, momentum, rotation, and gravitation.",
    sections: [
      {
        title: "What you learn",
        body:
          "Kinematics with vectors, Newton's laws, work and energy, systems of particles, rotation, oscillations, and gravitation—with calculus used throughout.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Typically a shorter exam than Physics 1/2 but mathematically dense; free response expects clear calculus setup and symbolic manipulation.",
      },
      {
        title: "How practice maps here",
        body:
          "Units mirror the mechanics portion of the C syllabus in order. Choose a unit to drill that chapter.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Set up integrals for continuous distributions, use torque and angular momentum consistently, and track reference frames.",
      },
    ],
  },
  "physics-c-em": {
    eyebrow: "AP Physics C: Electricity and Magnetism",
    summary:
      "Calculus-based E&M: electrostatics, circuits, magnetic fields, induction, Maxwell's equations in introductory form, and selected optics.",
    sections: [
      {
        title: "What you learn",
        body:
          "Fields and potentials, capacitors and dielectrics, DC and transient circuits, magnetic forces and fields, induction, Maxwell/Ampere/Faraday reasoning, and physical optics.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Challenging free response with integrals for charge and current distributions; multiple choice probes both concepts and computation.",
      },
      {
        title: "How practice maps here",
        body:
          "Units walk through electrostatics, circuits, magnetism, induction, and optics. Pick a unit to target weak areas.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Master Gauss and Ampere symmetry arguments, sign conventions for EMF, and energy storage in fields.",
      },
    ],
  },
  chem: {
    eyebrow: "AP Chemistry",
    summary:
      "Atomic structure, bonding, reactions, kinetics, thermodynamics, equilibrium, acids and bases, and electrochemistry at a first-year college level.",
    sections: [
      {
        title: "What you learn",
        body:
          "You explain structure-property relationships, predict reaction outcomes, use quantitative methods including stoichiometry and equilibrium expressions, and interpret lab data.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response mix conceptual questions with multi-step calculations; lab skills and representations appear throughout.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow the usual sequence from structure and IMF through reactions, kinetics, thermo, equilibrium, acids/bases, and applications. Select a unit to narrow practice.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Track moles carefully, justify approximations, and connect particle views to macroscopic observations.",
      },
    ],
  },
  bio: {
    eyebrow: "AP Biology",
    summary:
      "College-level biology emphasizing inquiry, modeling, and four big ideas: evolution, cellular processes, genetics, and ecology.",
    sections: [
      {
        title: "What you learn",
        body:
          "Chemistry of life, cell structure and energetics, signaling and cell cycle, heredity and gene expression, natural selection, and ecology—including interpretation of data and experimental design.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response often include graphs, experiments, and scenarios requiring you to predict, justify, and connect across scales.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with chemistry of life through ecology. Choose a unit to focus generated questions on one domain.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Think in models (DNA to phenotype, energy through ecosystems), use evidence from figures, and explain mechanism and consequence.",
      },
    ],
  },
  env: {
    eyebrow: "AP Environmental Science",
    summary:
      "Interdisciplinary study of Earth systems, human populations, resources, pollution, and global change—with science practices and solutions.",
    sections: [
      {
        title: "What you learn",
        body:
          "Ecosystems, biodiversity, populations, geology and resources, land and water use, energy, pollution, and global change—always linking science to tradeoffs and policy context.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice and free response include quantitative reasoning, analysis of models and data, and written argument about environmental problems.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow living systems, populations, Earth resources, energy, pollution, and global change. Pick a unit to study one theme at a time.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Connect local actions to global effects, evaluate sources, and compare mitigation and adaptation strategies.",
      },
    ],
  },
  ush: {
    eyebrow: "AP US History",
    summary:
      "A college-level survey of U.S. history from early Indigenous societies and European contact through the late 20th and 21st centuries, with emphasis on argument from evidence.",
    sections: [
      {
        title: "What you learn",
        body:
          "You interpret primary and secondary sources, explain cause and consequence, and connect national developments to broader patterns in politics, culture, economics, and society. Periodization (how historians divide time) is part of the skill set.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Paper-and-pencil administrations typically include multiple choice plus written parts: short answers, a document-based question (DBQ), and a long essay (LEQ). On VantaLearn, generated practice is multiple choice organized by chronological unit so you can drill one era at a time.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow major time spans (for example early contact through Revolution, Civil War and Reconstruction, the Gilded Age and Progressive Era, the world wars and Cold War, to the present). Pick a unit to keep questions inside that window.",
      },
      {
        title: "Themes to keep in mind",
        body:
          "American and national identity; work, exchange, and technology; geography and the environment; migration and settlement; politics and power; America in the world; American and regional culture; and social structures—woven across every period.",
      },
    ],
  },
  wh: {
    eyebrow: "AP World History: Modern",
    summary:
      "A global narrative from about 1200 CE to the present, focused on comparison, causation, continuity and change, and how societies connect through trade, conflict, and ideas.",
    sections: [
      {
        title: "What you learn",
        body:
          "You work at multiple scales: local stories and global processes. You explain how networks, states, and cultures transform over time and how historians use evidence to support claims about the past.",
      },
      {
        title: "How the AP exam is built",
        body:
          "The exam usually combines multiple choice with written tasks that ask you to reason about sources and write coherent historical arguments. Here, multiple-choice sets are grouped by era so each run stays in one historical band.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with broad eras (for example global tapestry and exchange before 1450, land-based and maritime empires, revolutions, industrialization and imperialism, the world wars and Cold War, decolonization, and recent globalization). Choose an era to focus your drill.",
      },
      {
        title: "Themes to keep in mind",
        body:
          "Humans and the environment; cultural developments and interactions; governance; economic systems; social interactions and organization; and technology and innovation—recurring lenses across regions.",
      },
    ],
  },
  euro: {
    eyebrow: "AP European History",
    summary:
      "European history from the Renaissance through the present: states, revolutions, industrialization, global empires, wars, and modern integration.",
    sections: [
      {
        title: "What you learn",
        body:
          "You analyze primary sources, explain continuity and change, compare regions, and connect intellectual, political, and social movements across centuries.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Typically multiple choice plus short answer, DBQ, and long essay components that reward clear thesis and evidence.",
      },
      {
        title: "How practice maps here",
        body:
          "Units move from Renaissance and Reformation through state-building, scientific and industrial change, world wars, Cold War, and contemporary Europe. Select a unit to keep items in that span.",
      },
      {
        title: "Themes to keep in mind",
        body:
          "Interaction of Europe and the world; poverty and prosperity; objective knowledge and subjective views; states and other institutions; individual and society; national and European identity.",
      },
    ],
  },
  gov: {
    eyebrow: "AP US Government and Politics",
    summary:
      "Foundations of American democracy, how institutions interact, civil liberties and rights, political behavior, and participation.",
    sections: [
      {
        title: "What you learn",
        body:
          "Constitutional principles, federalism, branches of government, linkage institutions, civil liberties and civil rights, and how ideology and public opinion shape policy.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice plus free-response tasks including a concept application, quantitative analysis, and SCOTUS comparison (formats can vary by year).",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow foundations, institutions, civil liberties and rights, beliefs and behavior, and participation. Pick a unit to focus drills.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Use accurate vocabulary, tie examples to constitutional clauses, and read charts and scenarios carefully.",
      },
    ],
  },
  "comp-gov": {
    eyebrow: "AP Comparative Government and Politics",
    summary:
      "Conceptual tools for comparing political systems, plus applied study of a set of course countries (regimes, institutions, cleavages, change).",
    sections: [
      {
        title: "What you learn",
        body:
          "You compare states, regimes, and policies using ideas like legitimacy, sovereignty, civil society, and economic development, then apply them to concrete cases.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice plus conceptual and country-based free response; expect scenarios that require comparison and explanation, not mere lists of facts.",
      },
      {
        title: "How practice maps here",
        body:
          "Units build from concepts through institutions, society, change, and policy. Choose a unit to anchor practice in that theme.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Name the concept first, then illustrate with two or more countries; avoid treating cases as isolated trivia.",
      },
    ],
  },
  macro: {
    eyebrow: "AP Macroeconomics",
    summary:
      "National income, price-level determination, financial sector, stabilization policy, and open-economy trade and finance.",
    sections: [
      {
        title: "What you learn",
        body:
          "You model the whole economy with aggregate demand and supply, interpret GDP and unemployment, study money and banking, evaluate fiscal and monetary policy, and analyze trade and exchange rates.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Mostly multiple choice with some free response; graphing and multi-step reasoning are central.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow basic concepts, indicators and cycles, AD-AS and policy, finance, long-run consequences, and open economy. Select a unit to drill one block.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Label axes and curves correctly, trace policy transmission mechanisms, and separate short-run from long-run effects.",
      },
    ],
  },
  micro: {
    eyebrow: "AP Microeconomics",
    summary:
      "How individuals and firms make decisions: supply and demand, elasticity, market structures, factor markets, and market failure.",
    sections: [
      {
        title: "What you learn",
        body:
          "Consumer and firm behavior, costs and supply, competitive and imperfect markets, factor pricing, externalities, public goods, and inequality basics.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Heavy use of graphs and intuition in multiple choice and free response; welfare and deadweight loss appear often.",
      },
      {
        title: "How practice maps here",
        body:
          "Units move from core concepts through supply and demand, firm behavior, imperfect competition, factor markets, and market failure. Pick a unit to focus.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Identify the decision-maker on each graph, use marginal thinking, and compare equilibrium to efficient outcomes.",
      },
    ],
  },
  psych: {
    eyebrow: "AP Psychology",
    summary:
      "Scientific study of behavior and mental processes: biology of behavior, cognition, development, clinical psychology, and social psychology.",
    sections: [
      {
        title: "What you learn",
        body:
          "Research methods, neuroscience and genetics, sensation and perception, learning, memory and cognition, motivation and emotion, development, personality, disorders and treatment, and social psychology.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Broad multiple-choice coverage with scenarios; some versions include free response focused on concepts and research design.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with the nine content areas on the framework. Choose a unit to concentrate on one domain.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Distinguish correlation and causation, name key researchers and paradigms where relevant, and apply terminology precisely.",
      },
    ],
  },
  "hum-geo": {
    eyebrow: "AP Human Geography",
    summary:
      "The study of where and why human activity is distributed across Earth—population, culture, political organization, agriculture, cities, and industry—using maps, data, and geographic models.",
    sections: [
      {
        title: "What you learn",
        body:
          "You read maps and spatial data, apply concepts like diffusion and scale, and use models (for example urban structure or agricultural land use) to explain real-world patterns and policy tradeoffs.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Expect multiple choice plus free-response tasks that ask you to interpret visuals and apply concepts to scenarios. On VantaLearn, practice is multiple choice grouped by course theme so you can target one topic area per session.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow major themes: thinking geographically, population and migration, cultural patterns, political geography, agriculture, cities and urban land use, and industrialization and development. Pick a theme to keep items in that scope.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Use the right geographic scale; connect concepts to places; compare regions; and explain consequences of human decisions on landscapes and resources.",
      },
    ],
  },
  lang: {
    eyebrow: "AP English Language and Composition",
    summary:
      "Reading and writing arguments: rhetorical analysis, synthesis with sources, and evidence-based composition for varied audiences and purposes.",
    sections: [
      {
        title: "What you learn",
        body:
          "You study how writers build arguments—claims, evidence, reasoning, and style—and you compose your own arguments with control and revision.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Three free-response tasks (synthesis, rhetorical analysis, argument) plus multiple choice on nonfiction prose. Timing and planning matter.",
      },
      {
        title: "How practice maps here",
        body:
          "Units span rhetorical situation, claims and evidence, reasoning, style, reading and writing arguments, research, and revision. Use units to review concepts that also support timed writing elsewhere.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Name rhetorical choices, not just devices; attribute sources; and keep thesis and line of reasoning visible.",
      },
    ],
  },
  lit: {
    eyebrow: "AP English Literature and Composition",
    summary:
      "Close reading of poetry, fiction, and drama, and writing literary arguments grounded in textual evidence.",
    sections: [
      {
        title: "What you learn",
        body:
          "You interpret diction, structure, imagery, and figurative language; compare texts; and develop defensible claims about meaning and effect.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice on paired passages and poetry plus three free responses: poetry analysis, prose analysis, and literary argument with a concept supplied.",
      },
      {
        title: "How practice maps here",
        body:
          "Units cover fiction, poetry, longer works, argument, complexity, figurative language, and theme. Use them to structure review before timed writes.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Anchor every paragraph in the text; balance paraphrase and quotation; and explain how form creates meaning.",
      },
    ],
  },
  "art-hist": {
    eyebrow: "AP Art History",
    summary:
      "Global art and architecture from prehistory to the present: form, context, patronage, and cultural exchange.",
    sections: [
      {
        title: "What you learn",
        body:
          "You identify works, attribute styles and periods, compare across cultures, and explain how historical context shapes meaning.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice with images plus free response comparing works, attributing style, and applying course concepts.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow regional and chronological buckets (for example ancient Mediterranean, later Europe, Asia, global contemporary). Pick a unit to drill that slice of the image set.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Practice visual identification, vocabulary for materials and technique, and the 'why' behind form and function.",
      },
    ],
  },
  "art-design": {
    eyebrow: "AP Art and Design",
    summary:
      "Studio inquiry: sustained investigation, experimentation, revision, and presentation of a cohesive body of work with written reflection.",
    sections: [
      {
        title: "What you learn",
        body:
          "You develop questions, iterate through making, document process, and articulate how works connect to inquiry and audience.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Portfolio assessment (sustained investigation and selected works) scored on inquiry, practice, experimentation, revision, and presentation—check the current AP Art and Design rubrics.",
      },
      {
        title: "How practice maps here",
        body:
          "Units name stages of inquiry, making, experimentation, communication, documentation, and critique. Use them as a checklist while building your portfolio; multiple-choice drills are a light supplement, not a substitute for studio work.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Show process visibly, connect choices to questions, and edit for clarity in artist statements.",
      },
    ],
  },
  music: {
    eyebrow: "AP Music Theory",
    summary:
      "Common-practice tonality: harmony, voice leading, form, and aural skills including dictation and sight-singing.",
    sections: [
      {
        title: "What you learn",
        body:
          "You spell and resolve harmony, analyze scores, realize figured bass, recognize forms, and train your ear for melodic and harmonic dictation.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple sections cover written theory and aural skills; sight-singing and dictation are timed and scored for accuracy and musicianship.",
      },
      {
        title: "How practice maps here",
        body:
          "Units move from fundamentals through harmony, progressions, melody, texture, form, and aural skills. Select a unit to reinforce one skill cluster.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Practice slowly with fixed do or movable do consistently, sing inner voices, and verify voice leading rules at the keyboard.",
      },
    ],
  },
  spanish: {
    eyebrow: "AP Spanish Language and Culture",
    summary:
      "Interpretive, interpersonal, and presentational communication around global themes—families, identities, science, daily life, and challenges.",
    sections: [
      {
        title: "What you learn",
        body:
          "You build proficiency in listening, reading, speaking, and writing while comparing cultures and using Spanish appropriately for context and audience.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice on print and audio, plus presentational writing and speaking, and simulated conversation—integrated tasks are common.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow AP themes (communities, identities, aesthetics, science and technology, contemporary life, global challenges) plus communication modes. Pick a unit to align review with one theme or skill.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Give structured responses, use transitions, and avoid rehearsed monologues in interpersonal tasks.",
      },
    ],
  },
  french: {
    eyebrow: "AP French Language and Culture",
    summary:
      "French proficiency across interpretive, interpersonal, and presentational modes, grounded in Francophone cultures and contemporary issues.",
    sections: [
      {
        title: "What you learn",
        body:
          "You understand authentic audio and print, compare cultures, and produce spoken and written French with appropriate register and evidence.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Section I combines listening and reading; Section II includes conversation, cultural comparison, and argumentative writing.",
      },
      {
        title: "How practice maps here",
        body:
          "Units mirror global themes and communication skills. Choose a unit to focus thematic vocabulary and task types together.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Plan before you speak, cite concrete cultural products and practices, and proofread for agreement and precision.",
      },
    ],
  },
  german: {
    eyebrow: "AP German Language and Culture",
    summary:
      "German language proficiency with emphasis on DACH-region cultures, contemporary life, and cross-cultural comparison.",
    sections: [
      {
        title: "What you learn",
        body:
          "You interpret authentic texts and audio, participate in conversations, and present arguments on personal and societal topics.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Integrated listening/reading, interpersonal speaking, presentational writing, and cultural comparison tasks.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with the same global themes as other world-language AP courses. Select a unit to drill one theme or mode.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Manage case and word order under pressure, and use cohesive devices to hold longer responses together.",
      },
    ],
  },
  latin: {
    eyebrow: "AP Latin",
    summary:
      "Reading Latin poetry and prose with attention to grammar, figures of style, meter, and historical and literary context.",
    sections: [
      {
        title: "What you learn",
        body:
          "You translate accurately, scan meter, discuss genre and rhetoric, and connect texts to Roman culture and later influence.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Multiple choice on syllabus authors plus free response: translation, analytical essay, and short answers on sight passages.",
      },
      {
        title: "How practice maps here",
        body:
          "Units cover comprehension, grammar, style, culture, sight reading, meter, and analytical writing. Pick a unit to stress one skill line.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Parse before you paraphrase, mark quantities for scansion, and quote Latin to support literary claims.",
      },
    ],
  },
  chinese: {
    eyebrow: "AP Chinese Language and Culture",
    summary:
      "Mandarin proficiency in simplified characters with strong interpretive and presentational skills and cultural comparison.",
    sections: [
      {
        title: "What you learn",
        body:
          "You build literacy and fluency in listening, reading, speaking, and writing while comparing Chinese-speaking communities and global issues.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Computer-based exam with listening, reading, writing, and speaking sections; tasks integrate skills and authentic materials.",
      },
      {
        title: "How practice maps here",
        body:
          "Units follow AP themes and communication modes. Use a unit to pair vocabulary and task practice for one theme.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Balance speed and accuracy in character writing, and organize spoken responses with clear openings and closings.",
      },
    ],
  },
  japanese: {
    eyebrow: "AP Japanese Language and Culture",
    summary:
      "Japanese proficiency with hiragana, katakana, and kanji in authentic contexts, plus cultural comparison across themes.",
    sections: [
      {
        title: "What you learn",
        body:
          "You comprehend spoken and written Japanese, respond in culturally appropriate ways, and present and compare ideas clearly.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Sections assess listening, reading, writing, and speaking with integrated tasks; register and completeness matter.",
      },
      {
        title: "How practice maps here",
        body:
          "Units align with global themes and modes. Select a unit to combine grammar review with theme-specific input.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Watch honorific choices and paragraph logic in writing; practice summarizing audio on first listen.",
      },
    ],
  },
  seminar: {
    eyebrow: "AP Seminar",
    summary:
      "Team and individual inquiry: asking questions, analyzing arguments across disciplines, and presenting evidence-based conclusions.",
    sections: [
      {
        title: "What you learn",
        body:
          "You evaluate sources, compare perspectives, synthesize lines of reasoning, collaborate, and communicate findings to an audience.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Through-course performance tasks (team and individual) plus end-of-course exams (including written argument and synthesis) contribute to the score—follow the current AP Seminar guide.",
      },
      {
        title: "How practice maps here",
        body:
          "Units map to inquiry stages from questioning through analysis, evaluation, synthesis, teamwork, research, and presentation. Multiple-choice items here support vocabulary and reasoning drills; the real course is project-based.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Track claims and warrants in every source, document team decisions, and revise after feedback.",
      },
    ],
  },
  research: {
    eyebrow: "AP Research",
    summary:
      "Independent academic research: question, methodology, analysis, and a 4,000–5,000 word paper with public presentation.",
    sections: [
      {
        title: "What you learn",
        body:
          "You design an ethical inquiry, review literature, choose methods, collect and interpret data or texts, and defend conclusions in writing and orally.",
      },
      {
        title: "How the AP exam is built",
        body:
          "Assessment centers on the academic paper, presentation, and oral defense scored with the AP Research rubric—not a traditional final exam.",
      },
      {
        title: "How practice maps here",
        body:
          "Units outline the research arc from topic to presentation. Use them as a pacing guide; quick multiple-choice practice is a minor supplement to your paper and process portfolio.",
      },
      {
        title: "Skills to keep in mind",
        body:
          "Maintain a narrow, answerable question, align methods to claims, and cite sources meticulously.",
      },
    ],
  },
};

for (const c of AP_COURSES) {
  if (!(c.id in AP_COURSE_OVERVIEWS)) {
    throw new Error(`apCourseOverviews: missing overview for catalog course id "${c.id}"`);
  }
}

export function getCourseOverview(courseId: string): CourseOverview | undefined {
  return AP_COURSE_OVERVIEWS[courseId];
}
