import { StudyResource } from "@/types";

/** Additional CB-style exams with figures (graphs / tables). */
export const EXAM_BANK_RESOURCES: StudyResource[] = [
 {
 id: "exam-bio-data",
 title: "AP Biology - Data Presentation",
 subject: "AP Biology",
 type: "practice_exam",
 created_at: new Date().toISOString(),
 content_data: {
 time_limit_minutes: 25,
 questions: [
 {
 id: "bio-d1",
 subject: "AP Biology",
 type: "multiple_choice",
 question:
 "A student measured enzyme activity at different temperatures. Based on the table, at which temperature was the reaction rate greatest?",
 figure: {
 kind: "table",
 title: "Table 1. Enzyme activity (mumol/min)",
 headers: ["Temperature ( deg C)", "Activity"],
 rows: [
 ["20", "12"],
 ["30", "28"],
 ["37", "45"],
 ["45", "22"],
 ["55", "5"],
 ],
 },
 options: ["20 deg C", "30 deg C", "37 deg C", "45 deg C"],
 correct_answer: "37 deg C",
 explanation: "The highest activity (45 mumol/min) occurs at 37 deg C - typical mammalian enzyme optimum.",
 },
 {
 id: "bio-d2",
 subject: "AP Biology",
 type: "multiple_choice",
 question:
 "The graph shows population size for an introduced species. Which best describes the trend from week 6 to week 10?",
 figure: {
 kind: "line_chart",
 title: "Figure 1. Population (arbitrary units) vs. time",
 yLabel: "Population",
 points: [
 { x: "W2", y: 20 },
 { x: "W4", y: 35 },
 { x: "W6", y: 42 },
 { x: "W8", y: 30 },
 { x: "W10", y: 18 },
 ],
 },
 options: [
 "Exponential growth throughout",
 "Decline after overshoot / resource limitation",
 "Stable carrying capacity reached by week 6",
 "No change in growth rate",
 ],
 correct_answer: "Decline after overshoot / resource limitation",
 explanation:
 "The population peaks then falls - consistent with overshooting carrying capacity and subsequent decline as resources become limiting.",
 },
 ],
 },
 },
 {
 id: "exam-macro-graph",
 title: "AP Macroeconomics - Models & Graphs",
 subject: "AP Macroeconomics",
 type: "practice_exam",
 created_at: new Date().toISOString(),
 content_data: {
 time_limit_minutes: 20,
 questions: [
 {
 id: "macro-g1",
 subject: "AP Macroeconomics",
 type: "multiple_choice",
 question:
 "The bar chart shows real GDP growth by quarter. Which quarter had the weakest growth?",
 figure: {
 kind: "bar_chart",
 title: "Figure 1. Real GDP growth rate (%)",
 yLabel: "Percent change",
 bars: [
 { label: "Q1", value: 2.1 },
 { label: "Q2", value: 0.4 },
 { label: "Q3", value: 1.8 },
 { label: "Q4", value: 2.5 },
 ],
 },
 options: ["Q1", "Q2", "Q3", "Q4"],
 correct_answer: "Q2",
 explanation: "Q2 has the smallest bar (0.4%), the weakest quarterly growth in the set.",
 },
 ],
 },
 },
 {
 id: "exam-physics-kine",
 title: "AP Physics 1 - Kinematics from graphs",
 subject: "AP Physics 1",
 type: "practice_exam",
 created_at: new Date().toISOString(),
 content_data: {
 time_limit_minutes: 20,
 questions: [
 {
 id: "ph1-g1",
 subject: "AP Physics 1",
 type: "multiple_choice",
 question:
 "The position-time graph is approximately linear from t = 1 s to t = 3 s. What is the object's velocity in that interval (use the grid: 1 m per vertical unit, 1 s per horizontal unit)?",
 figure: {
 kind: "line_chart",
 title: "Figure 1. Position vs. time",
 yLabel: "x (m)",
 points: [
 { x: "0", y: 0 },
 { x: "1", y: 2 },
 { x: "2", y: 4 },
 { x: "3", y: 6 },
 { x: "4", y: 6 },
 ],
 },
 options: ["0 m/s", "1 m/s", "2 m/s", "3 m/s"],
 correct_answer: "2 m/s",
 explanation: "Slope (delta x)/(delta t) = (6-2)/(3-1) = 4/2 = 2 m/s for the linear segment.",
 },
 ],
 },
 },
 {
 id: "exam-stats-bar",
 title: "AP Statistics - Displaying distributions",
 subject: "AP Statistics",
 type: "practice_exam",
 created_at: new Date().toISOString(),
 content_data: {
 time_limit_minutes: 15,
 questions: [
 {
 id: "st-g1",
 subject: "AP Statistics",
 type: "multiple_choice",
 question:
 "The bar graph shows counts of students by favorite lunch choice. What proportion chose Pizza if there are 40 students total?",
 figure: {
 kind: "bar_chart",
 title: "Figure 1. Lunch preference (count)",
 bars: [
 { label: "Pizza", value: 16 },
 { label: "Salad", value: 10 },
 { label: "Sandwich", value: 14 },
 ],
 },
 options: ["0.25", "0.35", "0.40", "0.50"],
 correct_answer: "0.40",
 explanation: "16/40 = 0.40 proportion for Pizza.",
 },
 ],
 },
 },
 {
 id: "exam-chem-table",
 title: "AP Chemistry - Periodic trends (data)",
 subject: "AP Chemistry",
 type: "practice_exam",
 created_at: new Date().toISOString(),
 content_data: {
 time_limit_minutes: 18,
 questions: [
 {
 id: "ch-t1",
 subject: "AP Chemistry",
 type: "multiple_choice",
 question: "Using only the data in the table, which atom has the smallest atomic radius?",
 figure: {
 kind: "table",
 title: "Table 1. Selected period 3 elements",
 headers: ["Element", "Atomic number", "Ionic radius (pm, typical cation)"],
 rows: [
 ["Na", "11", "102"],
 ["Mg", "12", "72"],
 ["Al", "13", "53"],
 ["Si", "14", "40 (approx.)"],
 ],
 },
 options: ["Na", "Mg", "Al", "Si"],
 correct_answer: "Si",
 explanation:
 "Across a period, effective nuclear charge increases; atomic/ionic size decreases - Si has the highest Z here and the smallest listed radius.",
 },
 ],
 },
 },
];
