import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AfrikaToday - Your Voice. Your Continent.",
  description: "AfrikaToday is your premier source for African news, culture, music, sports, and more.",
  keywords: "Africa, news, politics, culture, music, sports, entertainment, tech, business",
  openGraph: {
    title: "AfrikaToday - Your Voice. Your Continent.",
    description: "AfrikaToday is your premier source for African news, culture, music, sports, and more.",
    siteName: "AfrikaToday",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
