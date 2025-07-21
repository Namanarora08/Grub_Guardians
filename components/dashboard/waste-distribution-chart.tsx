"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type WasteDistributionChartProps = { data: any[] }

const COLORS = [
  "hsl(var(--chart-3))", // Orange
  "hsl(var(--chart-1))", // Green
  "hsl(var(--chart-4))", // Blue
  "hsl(var(--chart-5))", // Purple
  "hsl(var(--chart-6))", // Gray
]

export function WasteDistributionChart({ data }: WasteDistributionChartProps) {
  return (
    <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Waste Distribution by Category</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <ChartContainer
          config={{
            rice: { label: "Rice Items", color: COLORS[0] },
            vegetables: { label: "Vegetables", color: COLORS[1] },
            dal: { label: "Dal/Curry", color: COLORS[2] },
            bread: { label: "Bread/Roti", color: COLORS[3] },
            others: { label: "Others", color: COLORS[4] },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "20px" }}
                formatter={(value, entry) => (
                  <span className="text-muted-foreground">
                    {value} <span className="text-foreground">{entry.payload.value}%</span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
