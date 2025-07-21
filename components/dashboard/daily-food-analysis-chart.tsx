"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { mockDailyFoodAnalysis } from "@/lib/mock-data"

export function DailyFoodAnalysisChart() {
  return (
    <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Daily Food Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cooked: {
              label: "Cooked (kg)",
              color: "hsl(var(--chart-3))", // Orange-like
            },
            wasted: {
              label: "Wasted (kg)",
              color: "hsl(var(--chart-1))", // Green-like (changed from chart-2 to chart-1 to match image)
            },
            saved: {
              label: "Saved (kg)",
              color: "hsl(var(--chart-4))", // Blue-like (changed from chart-1 to chart-4 to match image)
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDailyFoodAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => {
                      if (props.payload) {
                        const { cooked, wasted, saved } = props.payload
                        return (
                          <div className="p-2">
                            <p className="text-sm font-medium text-foreground">{props.payload.day}</p>
                            <p className="text-sm" style={{ color: "hsl(var(--chart-3))" }}>
                              Cooked (kg): {cooked}
                            </p>
                            <p className="text-sm" style={{ color: "hsl(var(--chart-1))" }}>
                              Wasted (kg): {wasted}
                            </p>
                            <p className="text-sm" style={{ color: "hsl(var(--chart-4))" }}>
                              Saved (kg): {saved}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                }
              />
              <Legend />
              <Bar dataKey="cooked" fill="var(--color-cooked)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wasted" fill="var(--color-wasted)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saved" fill="var(--color-saved)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
