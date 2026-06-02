import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Gekku GrowthOS — Personal Growth Infrastructure",
  description: "AI-powered personal growth platform for university students. Focus, reflect, grow.",
  keywords: ["student success", "AI coach", "productivity", "wellbeing", "university"],
  openGraph: {
    title: "Gekku GrowthOS",
    description: "Your AI-powered university growth companion",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
