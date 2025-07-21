import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function fetchSummaryData() {
  try {
    const snapshot = await getDocs(collection(db, "summary"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("🔥 Error fetching summary data:", error);
    return [];
  }
}
