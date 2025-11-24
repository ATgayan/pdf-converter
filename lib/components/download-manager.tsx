"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, CheckCircle, AlertCircle, RotateCcw, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface DownloadItem {
  id: string
  filename: string
  status: "pending" | "downloading" | "completed" | "failed"
  progress: number
  blob?: Blob
  error?: string
  createdAt: Date
}

interface DownloadManagerProps {
  downloads: DownloadItem[]
  onRetry: (id: string) => void
  onRemove: (id: string) => void
  onDownload: (id: string) => void
}

export function DownloadManager({ downloads, onRetry, onRemove, onDownload }: DownloadManagerProps) {
  const { toast } = useToast()

  const handleDownload = (item: DownloadItem) => {
    if (!item.blob) {
      toast({
        title: "Download Failed",
        description: "File not available for download",
        variant: "destructive",
      })
      return
    }

    try {
      const url = window.URL.createObjectURL(item.blob)
      const a = document.createElement("a")
      a.href = url
      a.download = item.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onDownload(item.id)

      toast({
        title: "Download Started",
        description: `${item.filename} is being downloaded`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to start download",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString()
  }

  if (downloads.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Downloads ({downloads.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {downloads.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                {item.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                {item.status === "downloading" && <Download className="w-5 h-5 text-primary animate-pulse" />}
                {item.status === "failed" && <AlertCircle className="w-5 h-5 text-destructive" />}
                {item.status === "pending" && <div className="w-5 h-5 rounded-full border-2 border-muted" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{item.filename}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                </div>

                {item.status === "downloading" && (
                  <div className="space-y-1">
                    <Progress value={item.progress} className="h-1" />
                    <p className="text-xs text-muted-foreground">Downloading... {item.progress}%</p>
                  </div>
                )}

                {item.status === "failed" && item.error && <p className="text-xs text-destructive">{item.error}</p>}

                {item.status === "completed" && item.blob && (
                  <p className="text-xs text-muted-foreground">Ready to download • {formatFileSize(item.blob.size)}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.status === "completed" && (
                  <Button size="sm" onClick={() => handleDownload(item)} className="min-w-[80px]">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                )}

                {item.status === "failed" && (
                  <Button size="sm" variant="outline" onClick={() => onRetry(item.id)}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
