"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Utensils, Bell, MessageSquare, Settings } from "lucide-react" // Removed MapPin
import { Button } from "@/components/ui/button"

interface SidebarNavProps {
  activeTab: "dashboard" | "log-leftovers" | "push-notifications" | "view-feedback" | "settings" // Removed "hostel-locator"
  setActiveTab: (tab: "dashboard" | "log-leftovers" | "push-notifications" | "view-feedback" | "settings") => void // Removed "hostel-locator"
}

export function SidebarNav({ activeTab, setActiveTab }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      hoverColor: "hover:text-grubGreen-500", // Soft green
    },
    {
      id: "log-leftovers",
      label: "Log Leftovers",
      icon: Utensils,
      hoverColor: "hover:text-teal-400", // Teal
    },
    {
      id: "push-notifications",
      label: "Notifications",
      icon: Bell,
      hoverColor: "hover:text-amber-400", // Amber
    },
    {
      id: "view-feedback",
      label: "Feedback",
      icon: MessageSquare,
      hoverColor: "hover:text-grubGreen-500",
    },
    // Removed Hostel Locator item
    {
      id: "settings", // Placeholder for settings
      label: "Settings",
      icon: Settings,
      hoverColor: "hover:text-teal-400",
    },
  ]

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? "secondary" : "ghost"}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "w-full justify-start text-left text-muted-foreground transition-colors duration-200",
            item.hoverColor,
            {
              "text-foreground": activeTab === item.id,
            },
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
