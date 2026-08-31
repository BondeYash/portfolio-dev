"use client";

import { EditionProvider } from "@/components/edition-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <EditionProvider>{children}</EditionProvider>;
}
