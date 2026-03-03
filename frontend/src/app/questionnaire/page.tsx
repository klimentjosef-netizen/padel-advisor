import QuestionnaireForm from '@/components/questionnaire/QuestionnaireForm';

export default function QuestionnairePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <a href="/" className="text-amber-600 text-sm hover:underline">
            ← Zpět na úvod
          </a>
          <h1 className="text-3xl font-bold text-gray-800 mt-3">Najdi svou raketu</h1>
          <p className="text-gray-500 mt-1">Odpověz na otázky a dostaneš doporučení na míru</p>
        </div>
        <QuestionnaireForm />
      </div>
    </main>
  );
}
