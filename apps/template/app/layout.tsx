import type { Metadata } from "next";
import "./tailwind.css";
import { BaseLayout } from "@repo/ui";

export const metadata: Metadata = {
  title: "Template",
  description: "Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout forcedTheme="light">{children}</BaseLayout>;
}
