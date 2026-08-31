"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/** A newspaper prints a morning run and a late-night run. Same paper, different ink. */
type Edition = "morning" | "night";

type EditionContextValue = {
  edition: Edition;
  toggleEdition: () => void;
};

const EditionContext = createContext<EditionContextValue | null>(null);

function readEdition(): Edition {
  if (typeof window === "undefined") return "morning";
  const stored = window.localStorage.getItem("edition");
  if (stored === "morning" || stored === "night") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "morning";
}

export function EditionProvider({ children }: { children: React.ReactNode }) {
  const [edition, setEdition] = useState<Edition>("morning");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEdition(readEdition());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("dark", edition === "night");
    root.classList.toggle("light", edition === "morning");
    window.localStorage.setItem("edition", edition);
  }, [edition, hydrated]);

  const toggleEdition = useCallback(() => {
    setEdition((current) => (current === "night" ? "morning" : "night"));
  }, []);

  const value = useMemo(
    () => ({ edition, toggleEdition }),
    [edition, toggleEdition],
  );

  return (
    <EditionContext.Provider value={value}>{children}</EditionContext.Provider>
  );
}

export function useEdition() {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error("useEdition must be used within EditionProvider");
  }
  return context;
}
