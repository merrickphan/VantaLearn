/**
 * Concise course overviews for history / geography AP subjects where the dashboard
 * exposes a dedicated "Course overview" panel (see ApCourseUnitList).
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

/** Only courses that opt in to the overview panel need an entry here. */
export const AP_COURSE_OVERVIEWS: Partial<Record<string, CourseOverview>> = {
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
};

export function getCourseOverview(courseId: string): CourseOverview | undefined {
  return AP_COURSE_OVERVIEWS[courseId];
}
