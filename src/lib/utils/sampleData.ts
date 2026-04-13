import { StudyResource } from "@/types";

export const SAMPLE_RESOURCES: StudyResource[] = [
  {
    id: "1",
    title: "AP Biology: Cell Processes",
    subject: "AP Biology",
    type: "flashcard_set",
    created_at: new Date().toISOString(),
    content_data: {
      cards: [
        {
          id: "b1",
          front: "What is the powerhouse of the cell?",
          back: "The mitochondria. It produces ATP through cellular respiration (specifically oxidative phosphorylation in its inner membrane).",
        },
        {
          id: "b2",
          front: "Define osmosis.",
          back: "The passive movement of water molecules across a selectively permeable membrane from a region of higher water potential to lower water potential.",
        },
        {
          id: "b3",
          front: "What is the function of ribosomes?",
          back: "Ribosomes synthesize proteins by translating mRNA sequences into amino acid chains. They can be free in the cytoplasm or bound to the rough ER.",
        },
        {
          id: "b4",
          front: "Difference between mitosis and meiosis?",
          back: "Mitosis: produces 2 genetically identical diploid cells (for growth/repair). Meiosis: produces 4 genetically unique haploid cells (for sexual reproduction).",
        },
        {
          id: "b5",
          front: "What is the role of ATP in cells?",
          back: "ATP (Adenosine Triphosphate) is the cell's primary energy currency. When the bond to the third phosphate group is broken, energy is released for cellular work.",
        },
        {
          id: "b6",
          front: "What is natural selection?",
          back: "A mechanism of evolution where organisms with heritable traits better suited to their environment tend to survive and reproduce more successfully than others.",
        },
      ],
    },
  },
  {
    id: "2",
    title: "SAT Math: Algebra Fundamentals",
    subject: "SAT Math",
    type: "flashcard_set",
    created_at: new Date().toISOString(),
    content_data: {
      cards: [
        {
          id: "m1",
          front: "Quadratic Formula",
          back: "x = (-b ± √(b²-4ac)) / 2a\n\nUsed to solve ax² + bx + c = 0",
        },
        {
          id: "m2",
          front: "Slope formula",
          back: "m = (y₂ - y₁) / (x₂ - x₁)\n\nThe slope of a line through two points (x₁,y₁) and (x₂,y₂).",
        },
        {
          id: "m3",
          front: "What is the FOIL method?",
          back: "First, Outer, Inner, Last — a technique for multiplying two binomials.\n(a+b)(c+d) = ac + ad + bc + bd",
        },
        {
          id: "m4",
          front: "Difference of squares factoring",
          back: "a² - b² = (a + b)(a - b)\n\nExample: x² - 9 = (x+3)(x-3)",
        },
      ],
    },
  },
  {
    id: "3",
    title: "AP US History: Chapter 1-5 Review",
    subject: "AP US History",
    type: "practice_exam",
    created_at: new Date().toISOString(),
    content_data: {
      questions: [
        {
          id: "h1",
          question:
            "Which of the following best describes the primary motivation for European exploration of the Americas in the 15th and 16th centuries?",
          type: "multiple_choice",
          options: [
            "Spreading Christianity to indigenous peoples",
            "Desire for trade routes to Asia and wealth",
            "Escaping religious persecution in Europe",
            "Scientific curiosity about the new world",
          ],
          correct_answer: "Desire for trade routes to Asia and wealth",
          explanation:
            "While spreading Christianity was a secondary motivation, the primary driver was economic — finding new trade routes to Asia and acquiring gold, silver, and other resources.",
          subject: "AP US History",
        },
        {
          id: "h2",
          question:
            "The Columbian Exchange primarily resulted in which of the following?",
          type: "multiple_choice",
          options: [
            "An immediate increase in European populations",
            "The introduction of new foods, diseases, and peoples between hemispheres",
            "The peaceful integration of European and indigenous cultures",
            "A decline in the African slave trade",
          ],
          correct_answer:
            "The introduction of new foods, diseases, and peoples between hemispheres",
          explanation:
            "The Columbian Exchange was the widespread transfer of plants, animals, culture, human populations, technology, and diseases between the Americas and the Old World.",
          subject: "AP US History",
        },
        {
          id: "h3",
          question:
            "Explain how the headright system shaped early Virginia's social and economic development.",
          type: "free_response",
          correct_answer:
            "The headright system granted 50 acres of land to anyone who paid their own passage to Virginia, and an additional 50 acres for each servant they brought. This created a wealthy planter class who acquired large tobacco plantations, leading to demand for indentured servants and later enslaved Africans, establishing Virginia's plantation economy and social hierarchy.",
          explanation:
            "The headright system incentivized wealthy landowners to bring workers to Virginia, concentrating land ownership and creating a rigid class structure that defined the colonial South.",
          subject: "AP US History",
        },
      ],
      time_limit_minutes: 45,
    },
  },
  {
    id: "4",
    title: "AP Calculus AB: Derivatives",
    subject: "AP Calculus AB",
    type: "practice_exam",
    created_at: new Date().toISOString(),
    content_data: {
      questions: [
        {
          id: "c1",
          question: "If f(x) = 3x⁴ - 2x² + 5x - 1, what is f'(x)?",
          type: "multiple_choice",
          options: [
            "12x³ - 4x + 5",
            "12x³ - 4x - 1",
            "3x³ - 2x + 5",
            "12x⁴ - 4x² + 5",
          ],
          correct_answer: "12x³ - 4x + 5",
          explanation:
            "Using the power rule: d/dx[xⁿ] = nxⁿ⁻¹. So: d/dx[3x⁴] = 12x³, d/dx[-2x²] = -4x, d/dx[5x] = 5, d/dx[-1] = 0.",
          subject: "AP Calculus AB",
        },
        {
          id: "c2",
          question:
            "What is the derivative of f(x) = sin(x)·cos(x)?",
          type: "multiple_choice",
          options: [
            "-sin²(x) + cos²(x)",
            "cos²(x) - sin²(x)",
            "cos(2x)",
            "Both A, B, and C are correct",
          ],
          correct_answer: "Both A, B, and C are correct",
          explanation:
            "Using the product rule: f'(x) = cos(x)·cos(x) + sin(x)·(-sin(x)) = cos²(x) - sin²(x). This equals -sin²(x) + cos²(x) and also cos(2x) by the double angle identity.",
          subject: "AP Calculus AB",
        },
      ],
      time_limit_minutes: 30,
    },
  },
];
