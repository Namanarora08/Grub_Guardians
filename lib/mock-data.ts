export type FoodNotification = {
  id: string
  name: string
  image: string // Using string for placeholder URL
  createdAt: string // ISO string for creation timestamp
  location: string // This might become redundant if sourceHostelId is always used for display
  isClaimed?: boolean // New field to track if food is claimed
  sourceHostelId?: string // Can be 'hA' or 'Hostel A'
}

export type MenuItem = {
  id: string
  name: string
  description: string
  averageRating: number
  totalRatings: number
}

export type Poll = {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  expiresAt: string
}

export type MessRating = {
  id: string
  messName: string
  averageRating: number
  totalReviews: number
}

export type FeedbackItem = {
  id: string
  dishName: string
  rating: number // 1-5 scale
  comment: string
  timestamp: string
}

export type WasteData = {
  date: string // YYYY-MM-DD
  amountKg: number
}

export type DailyClaimedFood = {
  date: string // YYYY-MM-DD
  count: number
}

// --- Food Notification Local Storage Management ---
const LOCAL_STORAGE_KEY = "grubguardians_food_notifications"
const CLAIMED_FOOD_KEY = "grubguardians_claimed_food_counts"
const LOGGED_IN_HOSTEL_KEY = "grubguardians_logged_in_hostel" // New key for logged-in hostel
const NOTIFICATION_LIFESPAN_MS = 60 * 60 * 1000 // 1 hour (60 minutes) in milliseconds

export const getStoredFoodNotifications = (): FoodNotification[] => {
  if (typeof window === "undefined") return [] // Ensure it runs only on client-side
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to parse food notifications from localStorage:", error)
    return []
  }
}

export const addStoredFoodNotification = (notification: FoodNotification) => {
  if (typeof window === "undefined") return
  const currentNotifications = getStoredFoodNotifications()
  const updatedNotifications = [...currentNotifications, notification]
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotifications))
}

export const updateFoodNotificationStatus = (id: string, isClaimed: boolean) => {
  if (typeof window === "undefined") return
  const currentNotifications = getStoredFoodNotifications()
  const updatedNotifications = currentNotifications.map((notif) =>
    notif.id === id ? { ...notif, isClaimed: isClaimed } : notif,
  )
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotifications))
}

export const clearExpiredFoodNotifications = () => {
  if (typeof window === "undefined") return
  const currentNotifications = getStoredFoodNotifications()
  const now = Date.now()
  const filteredNotifications = currentNotifications.filter(
    (n) => now - new Date(n.createdAt).getTime() < NOTIFICATION_LIFESPAN_MS && !n.isClaimed,
  )
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredNotifications))
}

export const getFreshnessAndRemainingTime = (
  createdAt: string,
): { freshness: "Fresh" | "Moderate" | "Spoiling"; remainingTime: string; isExpired: boolean } => {
  const createdTime = new Date(createdAt).getTime()
  const now = Date.now()
  const elapsed = now - createdTime
  const remaining = NOTIFICATION_LIFESPAN_MS - elapsed

  if (remaining <= 0) {
    return { freshness: "Spoiling", remainingTime: "Expired", isExpired: true }
  }

  const totalSecondsRemaining = Math.floor(remaining / 1000)
  const remainingMinutes = Math.floor(totalSecondsRemaining / 60)
  const remainingSeconds = totalSecondsRemaining % 60

  let freshness: "Fresh" | "Moderate" | "Spoiling"
  // Fresh for first 20 minutes (60 mins down to 40 mins remaining)
  if (totalSecondsRemaining > 40 * 60) {
    freshness = "Fresh"
  }
  // Moderate for next 20 minutes (40 mins down to 20 mins remaining)
  else if (totalSecondsRemaining > 20 * 60) {
    freshness = "Moderate"
  }
  // Spoiling for last 20 minutes (20 mins down to 0 mins remaining)
  else {
    freshness = "Spoiling"
  }

  return {
    freshness,
    remainingTime: `${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`,
    isExpired: false,
  }
}

// --- Claimed Food Counts Local Storage Management ---
export const getDailyClaimedFoodCounts = (): DailyClaimedFood[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CLAIMED_FOOD_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to parse claimed food counts from localStorage:", error)
    return []
  }
}

export const addClaimedFoodCount = () => {
  if (typeof window === "undefined") return
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  const currentCounts = getDailyClaimedFoodCounts()

  const existingEntryIndex = currentCounts.findIndex((entry) => entry.date === today)

  if (existingEntryIndex !== -1) {
    currentCounts[existingEntryIndex].count += 1
  } else {
    currentCounts.push({ date: today, count: 1 })
  }
  localStorage.setItem(CLAIMED_FOOD_KEY, JSON.stringify(currentCounts))
}

export const getTodayClaimedFoodCount = (): number => {
  if (typeof window === "undefined") return 0
  const today = new Date().toISOString().split("T")[0]
  const currentCounts = getDailyClaimedFoodCounts()
  const todayEntry = currentCounts.find((entry) => entry.date === today)
  return todayEntry ? todayEntry.count : 0
}

// --- Logged-in Hostel Management ---
export const setLoggedInHostel = (hostelName: string | null) => {
  if (typeof window === "undefined") return
  if (hostelName) {
    localStorage.setItem(LOGGED_IN_HOSTEL_KEY, hostelName)
  } else {
    localStorage.removeItem(LOGGED_IN_HOSTEL_KEY)
  }
}

export const getLoggedInHostel = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LOGGED_IN_HOSTEL_KEY)
}

// --- Other Mock Data (unchanged, not using localStorage for these for simplicity) ---
export const mockMenuItems: MenuItem[] = [
  {
    id: "mi1",
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta with rich meat sauce.",
    averageRating: 4.5,
    totalRatings: 120,
  },
  {
    id: "mi2",
    name: "Paneer Butter Masala",
    description: "Creamy Indian cottage cheese curry.",
    averageRating: 4.2,
    totalRatings: 90,
  },
  {
    id: "mi3",
    name: "Grilled Chicken Salad",
    description: "Healthy salad with grilled chicken breast and fresh veggies.",
    averageRating: 3.8,
    totalRatings: 75,
  },
  {
    id: "mi4",
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice cooked with mixed vegetables and spices.",
    averageRating: 4.0,
    totalRatings: 110,
  },
  {
    id: "mi5",
    name: "Chocolate Brownie",
    description: "Warm, fudgy chocolate brownie with vanilla ice cream.",
    averageRating: 4.8,
    totalRatings: 150,
  },
]

export const mockPolls: Poll[] = [
  {
    id: "p1",
    question: "What new dessert would you like to see?",
    options: [
      { id: "opt1", text: "Apple Crumble", votes: 50 },
      { id: "opt2", text: "Cheesecake", votes: 70 },
      { id: "opt3", text: "Fruit Tart", votes: 30 },
    ],
    totalVotes: 150,
    expiresAt: "2025-07-25T23:59:59Z",
  },
  {
    id: "p2",
    question: "Which cuisine should we feature next week?",
    options: [
      { id: "optA", text: "Mexican", votes: 60 },
      { id: "optB", text: "Thai", votes: 45 },
      { id: "optC", text: "Mediterranean", votes: 35 },
    ],
    totalVotes: 140,
    expiresAt: "2025-07-22T23:59:59Z",
  },
]

export const mockMessLeaderboard: MessRating[] = [
  { id: "m1", messName: "Central Mess", averageRating: 4.7, totalReviews: 500 },
  { id: "m2", messName: "North Campus Cafe", averageRating: 4.3, totalReviews: 320 },
  { id: "m3", messName: "South Side Diner", averageRating: 3.9, totalReviews: 280 },
  { id: "m4", messName: "Faculty Club", averageRating: 4.5, totalReviews: 150 },
]

export const mockFeedback: FeedbackItem[] = [
  {
    id: "f1",
    dishName: "Spaghetti Bolognese",
    rating: 5,
    comment: "Absolutely delicious, perfect comfort food!",
    timestamp: "2025-07-19T18:00:00Z",
  },
  {
    id: "f2",
    dishName: "Grilled Chicken Salad",
    rating: 3,
    comment: "A bit bland, could use more seasoning.",
    timestamp: "2025-07-19T17:30:00Z",
  },
  {
    id: "f3",
    dishName: "Paneer Butter Masala",
    rating: 4,
    comment: "Good, but a little too sweet for my taste.",
    timestamp: "2025-07-18T19:15:00Z",
  },
  {
    id: "f4",
    dishName: "Vegetable Biryani",
    rating: 5,
    comment: "My favorite! Always fresh and flavorful.",
    timestamp: "2025-07-18T13:00:00Z",
  },
]

export const mockWasteAnalytics: WasteData[] = [
  { date: "2025-07-14", amountKg: 50 },
  { date: "2025-07-15", amountKg: 45 },
  { date: "2025-07-16", amountKg: 60 },
  { date: "2025-07-17", amountKg: 55 },
  { date: "2025-07-18", amountKg: 70 },
  { date: "2025-07-19", amountKg: 65 },
  { date: "2025-07-20", amountKg: 58 },
]

// New mock data for Analytics Dashboard
export const mockSummaryData = {
  efficiency: { value: 94, change: 2, unit: "%", description: "from last month" },
  savedPortions: { value: 1247, unit: "", description: "This month" },
  wasteReduced: { value: 65, unit: "kg", description: "This week" },
  costSavings: { value: 12450, unit: "₹", description: "This month" },
}

export const mockDailyFoodAnalysis = [
  { day: "Mon", cooked: 120, wasted: 15, saved: 105 },
  { day: "Tue", cooked: 150, wasted: 20, saved: 130 },
  { day: "Wed", cooked: 110, wasted: 10, saved: 100 },
  { day: "Thu", cooked: 145, wasted: 28, saved: 117 },
  { day: "Fri", cooked: 130, wasted: 18, saved: 112 },
  { day: "Sat", cooked: 90, wasted: 8, saved: 82 },
  { day: "Sun", cooked: 100, wasted: 12, saved: 88 },
]

export const mockEfficiencyTrend = [
  { month: "Jan", efficiency: 80, waste: 20 },
  { month: "Feb", efficiency: 82, waste: 18 },
  { month: "Mar", efficiency: 85, waste: 15 },
  { month: "Apr", efficiency: 88, waste: 12 },
  { month: "May", efficiency: 90, waste: 10 },
  { month: "Jun", efficiency: 92, waste: 8 },
]

export const mockWasteDistribution = [
  { category: "Rice Items", value: 35, color: "hsl(var(--chart-3))" }, // Orange
  { category: "Vegetables", value: 25, color: "hsl(var(--chart-1))" }, // Green
  { category: "Dal/Curry", value: 20, color: "hsl(var(--chart-4))" }, // Blue
  { category: "Bread/Roti", value: 15, color: "hsl(var(--chart-5))" }, // Purple
  { category: "Others", value: 5, color: "hsl(var(--chart-6))" }, // Gray
]

export const mockPortionsSavedTrend = [
  { day: "Mon", portions: 105 },
  { day: "Tue", portions: 130 },
  { day: "Wed", portions: 100 },
  { day: "Thu", portions: 117 },
  { day: "Fri", portions: 112 },
  { day: "Sat", portions: 82 },
  { day: "Sun", portions: 88 },
]

export const mockCostSavingsTrend = [
  { month: "Jan", savings: 10000 },
  { month: "Feb", savings: 10500 },
  { month: "Mar", savings: 11000 },
  { month: "Apr", savings: 11500 },
  { month: "May", savings: 12000 },
  { month: "Jun", savings: 12450 },
]

// Dummy data for hostels with estimated Thapar Campus coordinates
export interface Hostel {
  id: string
  name: string
  lat: number
  lng: number
}

export const mockHostels: Hostel[] = [
  { id: "hA", name: "Hostel A", lat: 30.353, lng: 76.366 },
  { id: "hB", name: "Hostel B", lat: 30.3535, lng: 76.367 },
  { id: "hC", name: "Hostel C", lat: 30.354, lng: 76.365 },
  { id: "hD", name: "Hostel D", lat: 30.3545, lng: 76.364 },
  { id: "hE", name: "Hostel E", lat: 30.36, lng: 76.3725 },
  { id: "hF", name: "Hostel F", lat: 30.356, lng: 76.37 },
  { id: "hG", name: "Hostel G", lat: 30.359, lng: 76.3715 },
  { id: "hH", name: "Hostel H", lat: 30.356, lng: 76.367 },
  { id: "hI", name: "Hostel I", lat: 30.3605, lng: 76.373 },
  { id: "hJ", name: "Hostel J", lat: 30.355, lng: 76.368 },
  { id: "hK", name: "Hostel K", lat: 30.363, lng: 76.368 },
  { id: "hL", name: "Hostel L", lat: 30.3635, lng: 76.371 },
  { id: "hM", name: "Hostel M", lat: 30.357, lng: 76.365 },
  { id: "hN", name: "Hostel N", lat: 30.3595, lng: 76.3735 },
  { id: "hPB", name: "Hostel PB", lat: 30.352, lng: 76.369 },
  { id: "hQ", name: "Hostel Q", lat: 30.3515, lng: 76.3705 },
]

// Add some mock food notifications with sourceHostelId
const now = new Date()
export const initialFoodNotifications: FoodNotification[] = [
  {
    id: "fn1",
    name: "Extra Pasta",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    location: "Hostel A Mess", // This will be overridden by sourceHostelId in card
    sourceHostelId: "Hostel A", // Changed to name for consistency with user input
  },
  {
    id: "fn2",
    name: "Leftover Dal Makhani",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    location: "Hostel F Mess",
    sourceHostelId: "Hostel F",
  },
  {
    id: "fn3",
    name: "Chicken Curry Portions",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    location: "Hostel E Mess",
    sourceHostelId: "Hostel E",
  },
  {
    id: "fn4",
    name: "Vegetable Pulao",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date(now.getTime() - 40 * 60 * 1000).toISOString(), // 40 mins ago (will be moderate)
    location: "Hostel J Mess",
    sourceHostelId: "Hostel J",
  },
  {
    id: "fn5",
    name: "Sandwiches",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date(now.getTime() - 50 * 60 * 1000).toISOString(), // 50 mins ago (will be spoiling)
    location: "Hostel B Mess",
    sourceHostelId: "Hostel B",
  },
]

// Initialize local storage with initial food notifications if empty
if (typeof window !== "undefined" && getStoredFoodNotifications().length === 0) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialFoodNotifications))
}
