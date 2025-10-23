import type { Metadata } from "next";
import BottomNav from "@/components/mobile/BottomNav";

export const metadata: Metadata = {
  title: "Lead2Build Mobile",
  description: "Мобильная версия CRM Lead2Build",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-blue-600 text-white shadow-md">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold">Lead2Build CRM</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

