import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

/** Ensure `.env.local` is read when rendering this layout (avoids a stale empty Desmos key from static optimization). */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
 title: "VantaLearn - Master AP® Exams",
 description:
 "Free AI-powered study platform for high school students. Practice exams, flashcards, and smart feedback to help you ace AP® tests.",
 keywords: ["AP exam prep", "AP study", "flashcards", "practice tests", "high school"],
 openGraph: {
 title: "VantaLearn",
 description: "AI-powered AP® prep for high school students",
 type: "website",
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 const desmosApiKey = (
 process.env.NEXT_PUBLIC_DESMOS_API_KEY ||
 process.env.DESMOS_API_KEY ||
 ""
 ).trim();

 return (
 <html lang="en" suppressHydrationWarning>
 <body
 className={`${geistSans.variable} ${geistMono.variable} antialiased bg-vanta-bg text-vanta-text min-h-screen text-lg leading-relaxed`}
 >
 <script
 dangerouslySetInnerHTML={{
 __html: `(function(){try{var t=localStorage.getItem("vanta_theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`,
 }}
 />
 <script
 dangerouslySetInnerHTML={{
 __html: `try{window.__VL_DESMOS_API_KEY__=${JSON.stringify(desmosApiKey)};}catch(e){}`,
 }}
 />
 <Providers>{children}</Providers>
 </body>
 </html>
 );
}
