import RacketDetailContent from "@/components/racket/RacketDetailContent";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RacketDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <RacketDetailContent id={id} />
      </div>
    </main>
  );
}
