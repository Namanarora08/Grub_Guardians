"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { setLoggedInHostel } from "@/lib/mock-data" // Import the new function

type LoginFormProps = {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [hostelName, setHostelName] = useState("") // New state for hostel name

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login logic
    if (username === "staff" && password === "password") {
      setLoggedInHostel(hostelName) // Store the hostel name on successful login
      toast.success(`Login successful! Logged in as staff from ${hostelName || "unknown hostel"}.`)
      onLoginSuccess()
    } else {
      toast.error("Invalid username or password.")
    }
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Staff Login</CardTitle>
        <CardDescription>Enter your credentials to access the staff dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="staff"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* New Hostel Name input */}
          <div className="grid gap-2">
            <Label htmlFor="hostelName">Hostel Name (e.g., Hostel A, Hostel F)</Label>
            <Input
              id="hostelName"
              type="text"
              placeholder="Hostel A"
              value={hostelName}
              onChange={(e) => setHostelName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-grubGreen-500 hover:bg-grubGreen-600">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
