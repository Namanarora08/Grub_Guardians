"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/lib/mock-data"
import { Star } from "lucide-react"
import toast from "react-hot-toast"

type RateMenuItemProps = {
  item: MenuItem
  onRate: (itemId: string, rating: number) => void
}

export function RateMenuItem({ item, onRate }: RateMenuItemProps) {
  const [currentRating, setCurrentRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (rating: number) => {
    setCurrentRating(rating)
  }

  const handleSubmit = () => {
    if (currentRating > 0) {
      onRate(item.id, currentRating)
      toast.success(`You rated "${item.name}" ${currentRating} stars!`)
      setCurrentRating(0) // Reset for next rating
    } else {
      toast.error("Please select a rating.")
    }
  }

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 cursor-pointer transition-colors ${
                (hoverRating || currentRating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted stroke-muted-foreground"
              }`}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({item.averageRating.toFixed(1)} avg. from {item.totalRatings} ratings)
          </span>
        </div>
        <Button onClick={handleSubmit} className="bg-grubGreen-500 hover:bg-grubGreen-600">
          Submit Rating
        </Button>
      </CardContent>
    </Card>
  )
}
