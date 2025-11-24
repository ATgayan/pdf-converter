"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

interface ConversionStep {
  id: string
  label: string
  status: "pending" | "processing" | "completed" | "error"
}

interface ConversionProgressProps {
  steps: ConversionStep[]
  currentProgress: number
  isVisible: boolean
}

export function ConversionProgress({ steps, currentProgress, isVisible }: ConversionProgressProps) {
  if (!isVisible) return null

  const completedSteps = steps.filter((step) => step.status === "completed").length
  const totalSteps = steps.length

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Conversion Progress</span>
            <span className="text-muted-foreground">
              {completedSteps} of {totalSteps} steps completed
            </span>
          </div>

          <Progress value={currentProgress} className="h-2" />

          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {step.status === "completed" && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {step.status === "processing" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                  {step.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-muted" />}
                  {step.status === "error" && <div className="w-4 h-4 rounded-full bg-destructive" />}
                </div>
                <span
                  className={`text-sm ${
                    step.status === "completed"
                      ? "text-green-600"
                      : step.status === "processing"
                        ? "text-primary font-medium"
                        : step.status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
