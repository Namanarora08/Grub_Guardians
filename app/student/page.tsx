import React from "react";
import { fetchSummaryData } from "@/lib/fetch-summary-data"; // ✅ Corrected path

export const dynamic = "force-dynamic"; // To allow dynamic data on server

export default async function StudentPage() {
  const summary = await fetchSummaryData();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Student Summary</h1>

      {summary.length === 0 ? (
        <p>No summary data available.</p>
      ) : (
        <div className="grid gap-4">
          {summary.map((item: any) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p><strong>Calories:</strong> {item.calories}</p>
              <p><strong>Protein:</strong> {item.protein}g</p>
              <p><strong>Carbs:</strong> {item.carbs}g</p>
              <p><strong>Fat:</strong> {item.fat}g</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
