import type { Metadata } from "next";
import "./globals.css";
import TopNav from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "Poradce Padel Raket",
  description: "Najdi idealni padelovou raketu podle svych preferenci",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="bg-gray-50 min-h-screen">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
