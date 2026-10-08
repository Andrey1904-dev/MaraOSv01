/* eslint-disable @next/next/no-page-custom-font -- Inter is loaded globally from the original design's font stylesheet. */
import type { Metadata, Viewport } from "next";
import "@/index.css";

export const metadata: Metadata = {
  title: "Mara OS — AI Creator Command Center",
  description:
    "Mara OS — the operating system for managing a virtual AI creator: content, audience, fans, conversations, monetization and AI decisions.",
};

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
