// lib/firestore.ts
import { db } from "./firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp
} from "firebase/firestore"

// Log a new food entry
export async function addFoodLog({
  uid,
  foodItem,
  calories,
  imageUrl
}: {
  uid: string
  foodItem: string
  calories: number
  imageUrl?: string
}) {
  await addDoc(collection(db, "foodLogs"), {
    uid,
    foodItem,
    calories,
    imageUrl: imageUrl || null,
    timestamp: Timestamp.now()
  })
}

// Fetch logs for a user
export async function getFoodLogs(uid: string) {
  const q = query(collection(db, "foodLogs"), where("uid", "==", uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
