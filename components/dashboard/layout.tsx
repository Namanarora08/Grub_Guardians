"use client"

import type React from "react"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarNav } from "./sidebar-nav"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
  setActiveTab: (tab: "dashboard" | "log-leftovers" | "push-notifications" | "view-feedback" | "settings") => void
}

export function DashboardLayout({ children, setActiveTab }: DashboardLayoutProps) {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, clear authentication tokens/session here
    toast.success("Logged out successfully!")
    router.push("/staff") // Redirect to login page
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-white/10 bg-card px-4 py-3 shadow-sm backdrop-blur-md md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-semibold text-foreground">
            GrubGuardians
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="sticky top-[65px] z-30 flex w-full flex-col border-b border-white/10 bg-card md:h-[calc(100vh-65px)] md:w-64 md:flex-shrink-0 md:border-r md:border-b-0 backdrop-blur-md bg-white/5 shadow-lg">
          <SidebarNav setActiveTab={setActiveTab} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
