import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { MessRating } from "@/lib/mock-data"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card" // Import Card

type LeaderboardTableProps = {
  data: MessRating[]
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <div className="overflow-x-auto rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Mess Name</TableHead>
              <TableHead className="text-right">Average Rating</TableHead>
              <TableHead className="text-right">Total Reviews</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .sort((a, b) => b.averageRating - a.averageRating)
              .map((mess, index) => (
                <TableRow key={mess.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{mess.messName}</TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    {mess.averageRating.toFixed(1)} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </TableCell>
                  <TableCell className="text-right">{mess.totalReviews}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
