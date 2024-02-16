export type SiteConfig = {
    name: string;
    description: string;
    developer: string;
    author: string;
    url: string;
    ogImage: string;
    keywords: string[];
  };

export const siteConfig: SiteConfig = {
  name: 'Cryptocurrency Price-Tracking Application',
  description: 'A simple cryptocurrency price-tracking application built with Next.js',
  developer: 'Arturs Vanags',
  author: 'Arturs Vanags',
  url: process.env.NEXT_PUBLIC_SITE_URL as string,
  ogImage: '#',
  keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'litecoin', 'ripple', 'dogecoin'],
};