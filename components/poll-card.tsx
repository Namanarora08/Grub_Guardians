"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Poll } from "@/lib/mock-data"
import toast from "react-hot-toast"

type PollCardProps = {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false) // Mock voting limit

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      onVote(poll.id, selectedOption)
      setHasVoted(true)
      toast.success("You voted successfully!")
    } else if (hasVoted) {
      toast.error("You have already voted in this poll.")
    } else {
      toast.error("Please select an option to vote.")
    }
  }

  const isPollExpired = new Date(poll.expiresAt) < new Date()

  return (
    <Card className="w-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <CardDescription>
          {isPollExpired ? "Poll ended." : `Ends: ${new Date(poll.expiresAt).toLocaleString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options.map((option) => (
          <div key={option.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  disabled={hasVoted || isPollExpired}
                  className="form-radio h-4 w-4 text-grubGreen-500 focus:ring-grubGreen-500"
                />
                {option.text}
              </label>
              <span className="text-sm text-muted-foreground">
                {option.votes} votes ({poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(0) : 0}%)
              </span>
            </div>
            <Progress value={poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0} className="h-2" />
          </div>
        ))}
        <Button
          onClick={handleVote}
          disabled={!selectedOption || hasVoted || isPollExpired}
          className="w-full bg-grubGreen-500 hover:bg-grubGreen-600"
        >
          {hasVoted ? "Voted" : "Vote"}
        </Button>
      </CardContent>
    </Card>
  )
}
