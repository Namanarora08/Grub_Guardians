"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

type FoodLog = {
  portion: string
  time: string
  createdAt: { seconds: number }
}

export function FoodLogList() {
  const [logs, setLogs] = useState<FoodLog[]>([])

  useEffect(() => {
    const q = query(collection(db, "foodLogs"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newLogs = snapshot.docs.map((doc) => doc.data() as FoodLog)
      setLogs(newLogs)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 mt-6 border rounded-md bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Recent Logs</h2>
      <ul className="space-y-2">
        {logs.length === 0 && <p className="text-sm text-gray-500">No logs yet.</p>}
        {logs.map((log, idx) => (
          <li key={idx} className="border p-2 rounded-md bg-white">
            🍛 {log.portion} at 🕒 {log.time}
          </li>
        ))}
      </ul>
    </div>
  )
}
