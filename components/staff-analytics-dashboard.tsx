// components/dashboard/StaffAnalyticsDashboard.tsx
"use client"

import { useAnalytics } from "@/hooks/useAnalytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpRight, Users, Trash2, IndianRupee } from "lucide-react"
import { mockSummaryData } from "@/lib/mock-data"

export function StaffAnalyticsDashboard() {
  const dailyData = useAnalytics<{ day: string; cooked: number; wasted: number; saved: number }>(
    "dailyFoodAnalysis"
  )
  const trendData = useAnalytics<{ month: string; efficiency: number; waste: number }>(
    "efficiencyTrend"
  )

  if (!dailyData || !trendData) {
    return <p>Loading analytics…</p>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Food Waste Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Efficiency */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSummaryData.efficiency.value}
              {mockSummaryData.efficiency.unit}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockSummaryData.efficiency.change > 0
                ? `+${mockSummaryData.efficiency.change}`
                : mockSummaryData.efficiency.change}
              {mockSummaryData.efficiency.unit} {mockSummaryData.efficiency.description}
            </p>
          </CardContent>
        </Card>
        {/* ... other summary cards ... */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Food Analysis Chart */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle>Daily Food Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="day" stroke="#eee" />
                <YAxis stroke="#eee" />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "#222" }} itemStyle={{ color: "#fff" }} />
                <Bar dataKey="cooked" fill="#8884d8" radius={[4, 4, 0, 0]} name="Cooked" />
                <Bar dataKey="wasted" fill="#ff4d4d" radius={[4, 4, 0, 0]} name="Wasted" />
                <Bar dataKey="saved"  fill="#82ca9d" radius={[4, 4, 0, 0]} name="Saved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Trend Chart */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle>Efficiency Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#eee" />
                <YAxis stroke="#eee" />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "#222" }} itemStyle={{ color: "#fff" }} />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                  name="Efficiency"
                />
                <Line
                  type="monotone"
                  dataKey="waste"
                  stroke="#ff4d4d"
                  activeDot={{ r: 8 }}
                  name="Waste"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
