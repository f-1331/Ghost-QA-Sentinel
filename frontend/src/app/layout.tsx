import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghost-QA Sentinel | Autonomous Chaos Crawler & Self-Healing Engine",
  description: "Next-generation B2B autonomous browser testing and AI self-healing security platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-sentinel-bg text-gray-100 antialiased selection:bg-sentinel-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}
