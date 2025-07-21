"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { sendPushNotification, uploadFile } from "@/lib/firebase-placeholders"
import { addStoredFoodNotification, type FoodNotification } from "@/lib/mock-data"

export function PushNotificationForm() {
  const [notificationText, setNotificationText] = useState("")
  const [hostelName, setHostelName] = useState("") // New state for hostel name
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      setImageFile(null)
      setImagePreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!notificationText.trim()) {
      toast.error("Notification message cannot be empty.")
      setLoading(false)
      return
    }

    let imageUrl = ""
    if (imageFile) {
      // TODO: Replace with actual Firebase Storage upload
      imageUrl = await uploadFile(`notifications/${Date.now()}-${imageFile.name}`, imageFile)
    }

    // TODO: Replace with actual Firebase Cloud Messaging (FCM) logic
    const result = await sendPushNotification({
      title: "GrubGuardians Alert",
      body: notificationText,
      imageUrl: imageUrl, // Pass image URL if available
    })

    if (result.success) {
      toast.success("Notification sent successfully!")

      // Simulate adding to student dashboard's mock data
      const newFoodNotification: FoodNotification = {
        id: `notif-${Date.now()}`,
        name: notificationText.substring(0, 50) + (notificationText.length > 50 ? "..." : ""), // Use notification text as food name
        image: imageUrl || "/placeholder.svg?height=200&width=300",
        createdAt: new Date().toISOString(),
        location: hostelName || "Campus-wide", // Use entered hostel name, fallback to "Campus-wide"
        sourceHostelId: hostelName || undefined, // Set sourceHostelId to the entered hostel name
      }
      addStoredFoodNotification(newFoodNotification)

      setNotificationText("")
      setHostelName("") // Clear hostel name field
      setImageFile(null)
      setImagePreviewUrl(null)
    } else {
      toast.error("Failed to send notification.")
    }
    setLoading(false)
  }

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Push Notification Form</CardTitle>
        <CardDescription>Send real-time alerts to students.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="notificationText">Notification Message</Label>
            <Textarea
              id="notificationText"
              value={notificationText}
              onChange={(e) => setNotificationText(e.target.value)}
              placeholder="e.g., 'Fresh pasta available at main cafeteria!'"
              rows={4}
              required
            />
          </div>
          {/* New Hostel Name input field */}
          <div className="grid gap-2">
            <Label htmlFor="hostelName">Hostel Name (Optional)</Label>
            <Input
              id="hostelName"
              type="text"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
              placeholder="e.g., Hostel A, Central Mess"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Upload Image (Optional)</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreviewUrl && (
              <div className="relative h-32 w-32 overflow-hidden rounded-md">
                <Image
                  src={imagePreviewUrl || "/placeholder.svg"}
                  alt="Image preview"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
          </div>
          <Button type="submit" className="bg-grubGreen-500 hover:bg-grubGreen-600" disabled={loading}>
            {loading ? "Sending..." : "Send Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
