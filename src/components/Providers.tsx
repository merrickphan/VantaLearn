"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

const ReactQueryDevtools = dynamic(
 () =>
 import("@tanstack/react-query-devtools").then((m) => m.ReactQueryDevtools),
 { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
 const [queryClient] = useState(
 () =>
 new QueryClient({
 defaultOptions: {
 queries: {
 staleTime: 60 * 1000,
 refetchOnWindowFocus: false,
 },
 },
 })
 );

 return (
 <QueryClientProvider client={queryClient}>
 <ThemeProvider>
 {children}
 {process.env.NODE_ENV === "development" && (
 <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
 )}
 </ThemeProvider>
 </QueryClientProvider>
 );
}
