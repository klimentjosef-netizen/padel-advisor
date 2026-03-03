import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-slate-800 text-lg">
          Poradce Padel Raket
        </Link>
        <div className="flex gap-2">
          <Link
            href="/questionnaire"
            className="text-sm text-gray-600 hover:text-amber-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Dotaznik
          </Link>
          <Link
            href="/results"
            className="text-sm text-gray-600 hover:text-amber-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Vysledky
          </Link>
        </div>
      </div>
    </nav>
  );
}
