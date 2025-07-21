"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { addDocument } from "@/lib/firebase"
import { getLoggedInHostel } from "@/lib/mock-data"

export function LogLeftoversForm() {
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [freshness, setFreshness] = useState<"Fresh" | "Moderate" | "Spoiling">("Fresh")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const loggedInHostel = getLoggedInHostel() // Get the logged-in hostel

    // Ensure food name, freshness, and a logged-in hostel are provided
    if (!foodName || !freshness || !loggedInHostel) {
      toast.error("Please fill in food name, freshness, and ensure you are logged in with a hostel.")
      setLoading(false)
      return
    }

    const newLeftover = {
      name: foodName,
      description,
      freshness,
      timestamp: new Date().toISOString(),
      day: new Date().toLocaleDateString("en-US", { weekday: "short" }), // e.g., "Mon", "Tue"
      sourceHostelId: loggedInHostel, // Add the source hostel ID
      location: `${loggedInHostel} Mess`, // Update location based on hostel
    }

    // TODO: Replace with actual Firebase Firestore addDoc
    await addDocument("leftovers", newLeftover)

    toast.success("Leftover logged successfully!")
    setFoodName("")
    setDescription("")
    setFreshness("Fresh")
    setLoading(false)
  }

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Log Leftovers</CardTitle>
        <CardDescription>Record available food items for redistribution.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Pasta, Chicken Curry"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any specific details or ingredients?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="freshness">Freshness Level</Label>
            <Select value={freshness} onValueChange={(value: "Fresh" | "Moderate" | "Spoiling") => setFreshness(value)}>
              <SelectTrigger id="freshness">
                <SelectValue placeholder="Select freshness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fresh">Fresh</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Spoiling">Spoiling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="bg-grubGreen-500 hover:bg-grubGreen-600" disabled={loading}>
            {loading ? "Logging..." : "Log Leftovers"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
