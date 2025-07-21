"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FoodNotificationCard } from "@/components/food-notification-card"
import { RateMenuItem } from "@/components/rate-menu-item"
import { PollCard } from "@/components/poll-card"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { Locator } from "@/components/locator/locator"
import { fetchSummaryData } from "@/lib/firebase/fetch-summary-data"
import { AppFooter } from "@/components/app-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowLeft, UtensilsCrossed } from "lucide-react"

// Remove mock-data imports
// import { getStoredFoodNotifications, clearExpiredFoodNotifications, getFreshnessAndRemainingTime, getTodayClaimedFoodCount } from "@/lib/mock-data"

export default function StudentDashboardPage() {
  const [foodNotifications, setFoodNotifications] = useState<FoodNotification[]>([])
  const [menuItems, setMenuItems] = useState(mockMenuItems)
  const [polls, setPolls] = useState(mockPolls)
  const [claimedFoodToday, setClaimedFoodToday] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      const allNotifications = await fetchSummaryData()

      const activeNotifications = allNotifications.filter((n) => {
        const createdAt = new Date(n.timestamp)
        const now = new Date()
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60)
        return diffMinutes <= 60 && !n.isClaimed
      })

      setFoodNotifications(activeNotifications)

      // Optional: count claimed today if your schema supports it
      const claimedCount = allNotifications.filter((n) => {
        const createdAt = new Date(n.timestamp)
        const now = new Date()
        const isToday = createdAt.toDateString() === now.toDateString()
        return isToday && n.isClaimed
      }).length

      setClaimedFoodToday(claimedCount)
    }

    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRateMenuItem = (itemId: string, rating: number) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              totalRatings: item.totalRatings + 1,
              averageRating:
                (item.averageRating * item.totalRatings + rating) / (item.totalRatings + 1),
            }
          : item,
      ),
    )
  }

  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              totalVotes: poll.totalVotes + 1,
              options: poll.options.map((option) =>
                option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
              ),
            }
          : poll,
      ),
    )
  }

  const handleFoodClaimed = () => {
    setFoodNotifications((prev) => prev.filter((n) => n.isClaimed !== true))
    setClaimedFoodToday((prev) => prev + 1)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b bg-background px-4 py-3 shadow-sm md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold">Student Dashboard</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="notifications">Food Notifications</TabsTrigger>
            <TabsTrigger value="rate-menu">Rate the Menu</TabsTrigger>
            <TabsTrigger value="poll-center">Poll Center</TabsTrigger>
            <TabsTrigger value="leaderboard">Mess Leaderboard</TabsTrigger>
            <TabsTrigger value="hostel-locator">Hostel Locator</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Food Notifications</h2>
            <div className="mb-6">
              <KpiCard
                title="Food Claimed Today"
                value={claimedFoodToday}
                description="Portions claimed by students today"
                icon={UtensilsCrossed}
                iconColorClass="text-amber-500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {foodNotifications.length > 0 ? (
                foodNotifications.map((notification) => (
                  <FoodNotificationCard
                    key={notification.id}
                    notification={notification}
                    onClaim={handleFoodClaimed}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
                  No active food notifications right now. Check back later!
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rate-menu" className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Rate the Menu</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <RateMenuItem key={item.id} item={item} onRate={handleRateMenuItem} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="poll-center" className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Poll Center</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} onVote={handleVotePoll} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Mess Leaderboard</h2>
            <LeaderboardTable data={mockMessLeaderboard} />
          </TabsContent>

          <TabsContent value="hostel-locator" className="mt-6">
            <h2 className="mb-4 text-2xl font-bold">Nearest Hostel Locator</h2>
            <Locator foodNotifications={foodNotifications} />
          </TabsContent>
        </Tabs>
      </main>
      <AppFooter />
    </div>
  )
}
