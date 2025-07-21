"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type React from "react"

interface KpiCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  iconColorClass?: string
}

export function KpiCard({ title, value, description, icon: Icon, iconColorClass }: KpiCardProps) {
  return (
    <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", iconColorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
