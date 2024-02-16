import '@/styles/globals.css';

import { fontHeading, fontMono, fontSans } from '@/lib/fonts';
import { ThemeProvider } from "@/components/theme-provider"
import { TailwindIndicator } from '@/lib/helpers/tailwind-indicator';
import { cn } from '@/lib/utils';

import { siteConfig } from '@/config/site';

import { Metadata } from 'next';


interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
          fontHeading.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

            <main className="relative">{children}</main>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
