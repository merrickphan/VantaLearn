import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

const orbitron = Orbitron({
 variable: "--font-orbitron",
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
 title: "VantaLearn - Master AP & SAT Exams",
 description:
 "Free AI-powered study platform for high school students. Practice exams, flashcards, and smart feedback to help you ace AP and SAT tests.",
 keywords: ["AP exam prep", "SAT study", "flashcards", "practice tests", "high school"],
 openGraph: {
 title: "VantaLearn",
 description: "AI-powered AP & SAT prep for high school students",
 type: "website",
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body
 className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased bg-vanta-bg text-vanta-text min-h-screen text-lg leading-relaxed`}
 >
 <script
 dangerouslySetInnerHTML={{
 __html: `(function(){try{var t=localStorage.getItem("vanta_theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`,
 }}
 />
 <Providers>{children}</Providers>
 </body>
 </html>
 );
}
