import Link from 'next/link';
import PadelRacketIcon from '@/components/icons/PadelRacketIcon';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 text-amber-400">
          <PadelRacketIcon className="w-20 h-20 mx-auto" />
        </div>
        <h1 className="text-5xl font-bold mb-4">Poradce Padel Raket</h1>
        <p className="text-xl text-slate-200 mb-3">
          Odpovez na par otazek a my ti doporucime idealni padelovou raketu
        </p>
        <p className="text-slate-300 mb-10 text-sm">
          Algoritmus porovna tve preference s databazi raket a vybere nejlepsi shodu
        </p>
        <Link
          href="/questionnaire"
          className="inline-block bg-amber-500 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-amber-400 transition-colors shadow-lg"
        >
          Spustit dotaznik →
        </Link>
        <p className="mt-5 text-slate-400 text-sm">Zabere jen 2 minuty · Zdarma</p>
      </div>
    </main>
  );
}
