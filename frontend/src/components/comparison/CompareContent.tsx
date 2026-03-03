"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiPost } from "@/services/api";
import { RacketSummary } from "@/types";

interface Props {
  ids: string | undefined;
}

export default function CompareContent({ ids }: Props) {
  const [rackets, setRackets] = useState<RacketSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idList = (ids ?? "").split(",").filter(Boolean);
    if (idList.length < 2) {
      setLoading(false);
      return;
    }

    apiPost<{ rackets: RacketSummary[] }>("/api/rackets/compare", { racket_ids: idList })
      .then((res) => setRackets(res.rackets))
      .catch(() => setRackets([]))
      .finally(() => setLoading(false));
  }, [ids]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!rackets.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-500">Vyber aspon dve rakety pro porovnani.</p>
        <Link href="/results" className="text-amber-600 text-sm mt-2 inline-block hover:underline">
          Zpet na vysledky
        </Link>
      </div>
    );
  }

  const rows: { label: string; key: keyof RacketSummary }[] = [
    { label: "Cena", key: "price" },
    { label: "Vaha", key: "weight" },
    { label: "Balance", key: "balance" },
    { label: "Tvrdost", key: "hardness" },
  ];

  return (
    <div>
      <div className="mb-4">
        <Link href="/results" className="text-amber-600 text-sm hover:underline">
          &larr; Zpet na vysledky
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">Porovnani raket</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-4 text-sm text-gray-500 font-medium">Parametr</th>
              {rackets.map((r) => (
                <th key={r.id} className="text-left p-4 text-sm font-bold text-gray-800">
                  {r.brand} {r.model}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-gray-50">
                <td className="p-4 text-sm text-gray-500">{row.label}</td>
                {rackets.map((r) => (
                  <td key={`${r.id}-${row.key}`} className="p-4 text-sm text-gray-800 font-medium">
                    {row.key === "price" ? `${r[row.key]} Kc` : row.key === "weight" ? `${r[row.key]} g` : String(r[row.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
