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
import { addDocument, uploadFile } from "@/lib/firebase-placeholders" // Import placeholders

export function ReportLeftoversForm() {
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [freshness, setFreshness] = useState<"Fresh" | "Moderate" | "Spoiling">("Fresh")
  const [location, setLocation] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!foodName || !freshness || !location) {
      toast.error("Please fill in food name, freshness, and location.")
      setLoading(false)
      return
    }

    let imageUrl = ""
    if (imageFile) {
      // TODO: Replace with actual Firebase Storage upload
      imageUrl = await uploadFile(`student-reported-leftovers/${Date.now()}-${imageFile.name}`, imageFile)
    }

    const newLeftoverReport = {
      name: foodName,
      description,
      freshness,
      location,
      image: imageUrl, // Use 'image' to match FoodNotification type
      timestamp: new Date().toISOString(),
      reportedBy: "student", // Indicate it's student-reported
    }

    // TODO: Replace with actual Firebase Firestore addDoc
    await addDocument("studentReportedLeftovers", newLeftoverReport)

    toast.success("Leftover report submitted successfully! Thank you for contributing.")
    setFoodName("")
    setDescription("")
    setFreshness("Fresh")
    setLocation("")
    setImageFile(null)
    setLoading(false)
  }

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Report Leftover Food</CardTitle>
        <CardDescription>Help us redistribute food by reporting what's available.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Pizza slices, Sandwiches"
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
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Library Cafe, Dorm A Lounge"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Upload Image (Optional)</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imageFile && <p className="text-sm text-muted-foreground">Selected: {imageFile.name}</p>}
          </div>
          <Button type="submit" className="bg-grubGreen-500 hover:bg-grubGreen-600" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
