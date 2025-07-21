"use client"

import { useState, useEffect } from "react"
import { KpiCard } from "@/components/dashboard/kpi-card"
import { DailyFoodAnalysisChart } from "@/components/dashboard/daily-food-analysis-chart"
import { EfficiencyTrendChart } from "@/components/dashboard/efficiency-trend-chart"
import { WasteDistributionChart } from "@/components/dashboard/waste-distribution-chart"
import { DashboardLayout } from "@/components/dashboard/layout"
import { ArrowUpRight, Users, Trash2, IndianRupee, UtensilsCrossed } from "lucide-react"
import { LogLeftoversForm } from "@/components/log-leftovers-form"
import { PushNotificationForm } from "@/components/push-notification-form"
import { FeedbackList } from "@/components/feedback-list"
import { FoodLogList } from "@/components/FoodLogList"

import {
  fetchSummaryData,
  fetchDailyFoodAnalysis,
  fetchEfficiencyTrend,
  fetchWasteDistribution,
  fetchFeedback,
  fetchTodayClaimedFoodCount,
} from "@/lib/firebase-data-fetchers"
import {
  mockSummaryData,
  mockDailyFoodAnalysis,
  mockEfficiencyTrend,
  mockWasteDistribution,
  mockFeedback,
} from "@/lib/mock-data"

export default function StaffDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "log-leftovers" | "push-notifications" | "view-feedback" | "settings" | "log-my-meals"
  >("dashboard")

  const [summaryData, setSummaryData] = useState(mockSummaryData)
  const [dailyFoodAnalysis, setDailyFoodAnalysis] = useState(mockDailyFoodAnalysis)
  const [efficiencyTrend, setEfficiencyTrend] = useState(mockEfficiencyTrend)
  const [wasteDistribution, setWasteDistribution] = useState(mockWasteDistribution)
  const [feedback, setFeedback] = useState(mockFeedback)
  const [claimedFoodToday, setClaimedFoodToday] = useState(0)

  useEffect(() => {
    const loadDashboardData = async () => {
      setSummaryData(await fetchSummaryData())
      setDailyFoodAnalysis(await fetchDailyFoodAnalysis())
      setEfficiencyTrend(await fetchEfficiencyTrend())
      setWasteDistribution(await fetchWasteDistribution())
      setFeedback(await fetchFeedback())
      setClaimedFoodToday(await fetchTodayClaimedFoodCount())
    }

    loadDashboardData()
    const interval = setInterval(loadDashboardData, 10000)
    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <DashboardLayout setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Food Waste Analytics</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Efficiency"
              value={`${summaryData.efficiency.value}${summaryData.efficiency.unit}`}
              description={`${summaryData.efficiency.change > 0 ? "+" : ""}${summaryData.efficiency.change}${summaryData.efficiency.unit} ${summaryData.efficiency.description}`}
              icon={ArrowUpRight}
              iconColorClass="text-grubGreen-500"
            />
            <KpiCard
              title="Saved Portions"
              value={summaryData.savedPortions.value.toLocaleString()}
              description={summaryData.savedPortions.description}
              icon={Users}
              iconColorClass="text-teal-400"
            />
            <KpiCard
              title="Waste Reduced"
              value={`${summaryData.wasteReduced.value}${summaryData.wasteReduced.unit}`}
              description={summaryData.wasteReduced.description}
              icon={Trash2}
              iconColorClass="text-red-400"
            />
            <KpiCard
              title="Cost Savings"
              value={`${summaryData.costSavings.unit}${summaryData.costSavings.value.toLocaleString()}`}
              description={summaryData.costSavings.description}
              icon={IndianRupee}
              iconColorClass="text-amber-400"
            />
            <KpiCard
              title="Food Claimed Today"
              value={claimedFoodToday}
              description="Portions claimed by students today"
              icon={UtensilsCrossed}
              iconColorClass="text-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="lg:col-span-2">
              <DailyFoodAnalysisChart data={dailyFoodAnalysis} />
            </div>
            <EfficiencyTrendChart data={efficiencyTrend} />
            <div className="xl:col-span-3">
              <WasteDistributionChart data={wasteDistribution} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "log-leftovers" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Log Leftovers</h2>
          <LogLeftoversForm />
        </div>
      )}

      {activeTab === "push-notifications" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Push Notification Form</h2>
          <PushNotificationForm />
        </div>
      )}

      {activeTab === "view-feedback" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">View Feedback</h2>
          <FeedbackList feedback={feedback} />
        </div>
      )}

      {activeTab === "log-my-meals" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Log My Meals</h2>
          <FoodLogger uid="demo-user-001" />
          <FoodLogList /> {/* ✅ Add this line */}
        </div>
      )}


      {activeTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Settings content will go here.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
