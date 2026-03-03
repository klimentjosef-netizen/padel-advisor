"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/services/api";
import { RacketDetail } from "@/types";

interface Props {
  id: string;
}

export default function RacketDetailContent({ id }: Props) {
  const [racket, setRacket] = useState<RacketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiGet<RacketDetail>(`/api/rackets/${id}`)
      .then(setRacket)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !racket) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-500">Raketa nebyla nalezena.</p>
        <Link href="/results" className="text-amber-600 text-sm mt-2 inline-block hover:underline">
          Zpet na vysledky
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Cena", value: `${racket.price} Kc` },
    { label: "Vaha", value: `${racket.weight} g` },
    { label: "Balance", value: racket.balance },
    { label: "Tvrdost", value: racket.hardness },
    { label: "Tvar", value: racket.play_style },
    { label: "Uroven", value: racket.player_level },
    { label: "Pozice", value: racket.player_position },
    { label: "Rok", value: String(racket.year) },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <Link href="/results" className="text-amber-600 text-sm hover:underline">
        &larr; Zpet na vysledky
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mt-3">
        {racket.brand} {racket.model}
      </h1>
      {racket.description && (
        <p className="text-gray-600 mt-2">{racket.description}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase">{s.label}</div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{racket.control_rating}</div>
          <div className="text-xs text-gray-500">Control</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{racket.power_rating}</div>
          <div className="text-xs text-gray-500">Power</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{racket.sweet_spot_size}</div>
          <div className="text-xs text-gray-500">Sweet Spot</div>
        </div>
      </div>

      {(racket.material_face || racket.material_frame) && (
        <div className="mt-6 text-sm text-gray-600">
          <p>Povrch: {racket.material_face}</p>
          <p>Ram: {racket.material_frame}</p>
        </div>
      )}
    </div>
  );
}
