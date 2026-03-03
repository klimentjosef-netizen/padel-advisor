import ResultsContent from "@/components/results/ResultsContent";

interface Props {
  searchParams: Promise<{ payload?: string }>;
}

export default async function ResultsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <ResultsContent payload={params.payload} />
      </div>
    </main>
  );
}
