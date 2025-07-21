import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

// ✅ Already present
export async function fetchSummaryData() {
  try {
    const snapshot = await getDocs(collection(db, "summary"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("🔥 Error fetching summary data:", error);
    return [];
  }
}

// ✅ Add these new functions below

export async function fetchDailyFoodAnalysis() {
  try {
    const snapshot = await getDocs(collection(db, "daily_food_analysis"));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("🔥 Error fetching daily food analysis:", error);
    return [];
  }
}

export async function fetchEfficiencyTrend() {
  try {
    const snapshot = await getDocs(collection(db, "efficiency_trend"));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("🔥 Error fetching efficiency trend:", error);
    return [];
  }
}

export async function fetchWasteDistribution() {
  try {
    const snapshot = await getDocs(collection(db, "waste_distribution"));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("🔥 Error fetching waste distribution:", error);
    return [];
  }
}

export async function fetchFeedback() {
  try {
    const snapshot = await getDocs(collection(db, "feedback"));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("🔥 Error fetching feedback:", error);
    return [];
  }
}

export async function fetchTodayClaimedFoodCount() {
  try {
    const q = query(
      collection(db, "claimed_food"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }
    return {};
  } catch (error) {
    console.error("🔥 Error fetching today's claimed food count:", error);
    return {};
  }
}
