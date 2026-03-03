import CompareContent from "@/components/comparison/CompareContent";

interface Props {
  searchParams: Promise<{ ids?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <CompareContent ids={params.ids} />
      </div>
    </main>
  );
}
