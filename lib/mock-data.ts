export const LOCAL_STORAGE_KEY = "food_notifications";

export type FoodNotification = {
  id: string;
  title: string;
  description: string;
  sourceHostelId: string;
  timestamp: string;
};

export type Hostel = {
  id: string;
  name: string;
};

export const mockHostels: Hostel[] = [
  { id: "hA", name: "Hostel A" },
  { id: "hB", name: "Hostel B" },
  { id: "hC", name: "Hostel C" },
  { id: "hD", name: "Hostel D" },
];

export const initialFoodNotifications: FoodNotification[] = [
  {
    id: "1",
    title: "Paneer Butter Masala Available",
    description: "Paneer Butter Masala is now being served in Hostel A.",
    sourceHostelId: "hA", // 🔁 Changed from "Hostel A" to "hA"
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Chicken Biryani Special",
    description: "Chicken Biryani is being served tonight in Hostel B.",
    sourceHostelId: "hB",
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Extra Sweets in Mess",
    description: "Hostel C is offering extra sweets for dinner today.",
    sourceHostelId: "hC",
    timestamp: new Date().toISOString(),
  },
];

// 🔁 Helper functions (safe for use in client components only)

export function getStoredFoodNotifications(): FoodNotification[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveFoodNotifications(notifications: FoodNotification[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
}
