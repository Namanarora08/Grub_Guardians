"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type EfficiencyTrendChartProps = { data: any[] }

export function EfficiencyTrendChart({ data }: EfficiencyTrendChartProps) {
  return (
    <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Efficiency Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            efficiency: {
              label: "Efficiency (%)",
              color: "hsl(var(--chart-1))", // Green-like
            },
            waste: {
              label: "Waste (%)",
              color: "hsl(var(--chart-2))", // Red-like
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="waste" stroke="var(--color-waste)" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
