import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

interface BaseLayoutProps extends React.ComponentProps<typeof NextThemesProvider> {
  children: React.ReactNode;
}

export function BaseLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          {...props}
        >
          {children}
        </NextThemesProvider>
      </body>
    </html>
  );
}
