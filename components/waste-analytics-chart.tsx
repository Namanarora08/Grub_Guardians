// components/dashboard/waste-analytics-chart.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WasteData } from "@/lib/mock-data"

type WasteAnalyticsChartProps = {
  data: WasteData[]
}

export function WasteAnalyticsChart({ data }: WasteAnalyticsChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amountKg))
  const chartHeight = 200 // px

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Weekly Waste Analytics</CardTitle>
        <CardDescription>
          Amount of food waste (in kg) over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="relative flex h-[200px] items-end justify-around gap-2 border-b border-l pb-2 pl-2"
          style={{ height: `${chartHeight}px` }}
        >
          {data.map((day) => (
            <div
              key={day.date}
              className="group relative flex w-8 flex-col items-center justify-end"
            >
              <div
                className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(day.amountKg / maxAmount) * chartHeight * 0.8}px`,
                  backgroundColor: "#ff4d4d",   // 💥 waste bars in red
                }}
              />
              <span className="mt-1 text-xs text-muted-foreground">
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className="absolute bottom-full mb-1 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block dark:bg-white dark:text-black">
                {day.amountKg} kg
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Food Waste (kg)
        </div>
      </CardContent>
    </Card>
  )
}
