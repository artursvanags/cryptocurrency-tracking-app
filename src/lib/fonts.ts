import { JetBrains_Mono as FontMono } from "next/font/google";
import { GeistSans as FontSans } from "geist/font/sans";

export const fontSans = FontSans;

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontHeading = fontSans;