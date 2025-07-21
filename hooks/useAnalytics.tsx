"use client"

import { useState, useEffect } from "react"
import { collection, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useAnalytics<T>(docPath: string): T[] | null {
  const [data, setData] = useState<T[] | null>(null)

  useEffect(() => {
    async function load() {
      const ref = doc(db, "analytics", docPath)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setData(snap.data().values as T[])
      } else {
        console.warn(`No analytics for ${docPath}`)
      }
    }
    load()
  }, [docPath])

  return data
}
