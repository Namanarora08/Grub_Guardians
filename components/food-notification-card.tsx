"use client" // Mark as client component for dynamic time updates

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Import Button
import {
  getFreshnessAndRemainingTime,
  updateFoodNotificationStatus,
  addClaimedFoodCount,
  type FoodNotification,
} from "@/lib/mock-data"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type FoodNotificationCardProps = {
  notification: FoodNotification
  onClaim?: (id: string) => void // Optional callback for claiming
}

export function FoodNotificationCard({ notification, onClaim }: FoodNotificationCardProps) {
  const [timeInfo, setTimeInfo] = useState(() => getFreshnessAndRemainingTime(notification.createdAt))
  const [isClaimed, setIsClaimed] = useState(notification.isClaimed || false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getFreshnessAndRemainingTime(notification.createdAt))
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [notification.createdAt])

  const freshnessColor = {
    Fresh: "bg-grubGreen-500 hover:bg-grubGreen-600",
    Moderate: "bg-yellow-500 hover:bg-yellow-600",
    Spoiling: "bg-red-500 hover:bg-red-600",
  }

  const handleClaimFood = () => {
    if (!isClaimed) {
      setIsClaimed(true)
      updateFoodNotificationStatus(notification.id, true) // Update mock data
      addClaimedFoodCount() // Increment daily claimed count
      toast.success("Food claimed! Enjoy your meal.")
      onClaim?.(notification.id) // Call parent callback if provided
    }
  }

  if (timeInfo.isExpired || isClaimed) {
    return null // Don't render if expired or claimed
  }

  // Display sourceHostelId directly if available, otherwise fallback to location
  const displayLocation = notification.sourceHostelId || notification.location

  return (
    <Card className="w-full overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg backdrop-blur-md bg-white/5 border border-white/10 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 ease-out">
      <div className="relative h-48 w-full">
        <Image
          src={notification.image || "/placeholder.svg"}
          alt={notification.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
          quality={75}
          priority
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{notification.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{displayLocation}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge className={`${freshnessColor[timeInfo.freshness]} text-base px-3 py-1.5`}>{timeInfo.freshness}</Badge>
          <span className="text-sm text-muted-foreground">Time Left: {timeInfo.remainingTime}</span>
        </div>
        <Button
          onClick={handleClaimFood}
          disabled={isClaimed}
          className="w-full bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200"
        >
          {isClaimed ? "Claimed!" : "Claim Food"}
        </Button>
      </CardContent>
    </Card>
  )
}
