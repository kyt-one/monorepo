import type { Metadata } from "next";
import "./tailwind.css";
import { BaseLayout } from "@repo/ui";

export const metadata: Metadata = {
  title: "Profile - MyBio Space",
  description: "Public Media Kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout forcedTheme="light">{children}</BaseLayout>;
}
