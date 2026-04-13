"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AppTheme = "light" | "dark";

const STORAGE_KEY = "vanta_theme";

function readStoredTheme(): AppTheme {
	if (typeof window === "undefined") return "light";
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		if (v === "dark" || v === "light") return v;
	} catch {
		/* ignore */
	}
	return "light";
}

function applyDomTheme(theme: AppTheme) {
	if (typeof document === "undefined") return;
	document.documentElement.dataset.theme = theme;
}

type ThemeContextValue = {
	theme: AppTheme;
	setTheme: (t: AppTheme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<AppTheme>("light");

	useEffect(() => {
		const t = readStoredTheme();
		setThemeState(t);
		applyDomTheme(t);
	}, []);

	const setTheme = useCallback((t: AppTheme) => {
		setThemeState(t);
		applyDomTheme(t);
		try {
			localStorage.setItem(STORAGE_KEY, t);
		} catch {
			/* ignore */
		}
		window.dispatchEvent(new CustomEvent("vanta-theme-changed", { detail: t }));
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(theme === "light" ? "dark" : "light");
	}, [theme, setTheme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			toggleTheme,
		}),
		[theme, setTheme, toggleTheme],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return ctx;
}
