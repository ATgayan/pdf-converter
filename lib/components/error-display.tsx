"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, X } from "lucide-react"

interface ErrorDisplayProps {
  error: string | Error
  onRetry?: () => void
  onDismiss?: () => void
  variant?: "default" | "destructive"
}

export function ErrorDisplay({ error, onRetry, onDismiss, variant = "destructive" }: ErrorDisplayProps) {
  const errorMessage = typeof error === "string" ? error : error.message

  const getErrorDetails = (message: string) => {
    // Provide user-friendly error messages
    if (message.includes("Failed to fetch")) {
      return {
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your internet connection and try again.",
      }
    }

    if (message.includes("file type") || message.includes("Invalid file")) {
      return {
        title: "Invalid File Type",
        description:
          "Please make sure you're uploading the correct file format (JPG, PNG for images or PDF for documents).",
      }
    }

    if (message.includes("file size") || message.includes("too large")) {
      return {
        title: "File Too Large",
        description: "The file you're trying to upload is too large. Please try with a smaller file.",
      }
    }

    if (message.includes("timeout") || message.includes("timed out")) {
      return {
        title: "Request Timeout",
        description: "The conversion is taking longer than expected. Please try again with smaller files.",
      }
    }

    if (message.includes("memory") || message.includes("out of memory")) {
      return {
        title: "Processing Error",
        description: "The file is too complex to process. Please try with simpler files or fewer images.",
      }
    }

    return {
      title: "Conversion Failed",
      description: message || "An unexpected error occurred during conversion.",
    }
  }

  const { title, description } = getErrorDetails(errorMessage)

  return (
    <Alert variant={variant} className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">{description}</AlertDescription>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </Alert>
  )
}
