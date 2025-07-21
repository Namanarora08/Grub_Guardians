import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeedbackItem } from "@/lib/mock-data"
import { Star } from "lucide-react"

type FeedbackListProps = {
  feedback: FeedbackItem[]
}

export function FeedbackList({ feedback }: FeedbackListProps) {
  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>Student Feedback</CardTitle>
        <CardDescription>View recent feedback on dishes.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {feedback.length === 0 ? (
          <p className="text-muted-foreground">No feedback available yet.</p>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="rounded-md border p-4 bg-background/50">
              {" "}
              {/* Added bg-background/50 for inner card */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.dishName}</h3>
                <div className="flex items-center gap-1 text-sm">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - item.rating }).map((_, i) => (
                    <Star key={i + item.rating} className="h-4 w-4 fill-muted stroke-muted-foreground" />
                  ))}
                  <span className="ml-1 text-muted-foreground">({item.rating}/5)</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.comment}</p>
              <p className="mt-2 text-xs text-right text-muted-foreground">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
