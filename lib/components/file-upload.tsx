"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, FileImage, FileText, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileWithPreview extends File {
  preview?: string
}

interface FileUploadProps {
  accept: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  onFilesChange: (files: FileWithPreview[]) => void
  type: "image" | "pdf"
  className?: string
}

export function FileUpload({
  accept,
  maxFiles = 10,
  maxSize = 10485760,
  onFilesChange,
  type,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: type === "image" ? URL.createObjectURL(file) : undefined,
        })
        return fileWithPreview
      })

      setFiles((prev) => {
        const updated = [...prev, ...newFiles].slice(0, maxFiles)
        onFilesChange(updated)
        return updated
      })

      // Simulate upload progress
      newFiles.forEach((file) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }))
          if (progress >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setUploadProgress((prev) => {
                const { [file.name]: _, ...rest } = prev
                return rest
              })
            }, 1000)
          }
        }, 100)
      })
    },
    [maxFiles, onFilesChange, type],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: type === "image",
  })

  const removeFile = (fileName: string) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.name !== fileName)
      onFilesChange(updated)
      return updated
    })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (type !== "image") return
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (type !== "image" || draggedIndex === null) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (type !== "image" || draggedIndex === null) return
    e.preventDefault()

    if (draggedIndex !== dropIndex) {
      setFiles((prev) => {
        const newFiles = [...prev]
        const draggedFile = newFiles[draggedIndex]
        newFiles.splice(draggedIndex, 1)
        newFiles.splice(dropIndex, 0, draggedFile)
        onFilesChange(newFiles)
        return newFiles
      })
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          files.length > 0 && "border-primary/30",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {type === "image" ? (
            <FileImage className="w-12 h-12 text-muted-foreground" />
          ) : (
            <FileText className="w-12 h-12 text-muted-foreground" />
          )}

          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-primary">Drop files here</p>
              <p className="text-sm text-muted-foreground">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Drop your {type === "image" ? "images" : "PDF"} here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {type === "image"
              ? `Supports JPG, PNG files up to ${formatFileSize(maxSize)} each (max ${maxFiles} files)`
              : `Supports PDF files up to ${formatFileSize(maxSize)}`}
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-foreground">
            Uploaded Files ({files.length})
            {type === "image" && files.length > 1 && (
              <span className="text-xs text-muted-foreground ml-2">Drag to reorder</span>
            )}
          </h3>
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div
                key={file.name}
                draggable={type === "image"}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "flex items-center gap-3 p-3 bg-card rounded-lg border transition-all",
                  type === "image" && "cursor-move",
                  draggedIndex === index && "opacity-50 scale-95",
                  dragOverIndex === index && draggedIndex !== index && "border-primary bg-primary/5",
                )}
              >
                {type === "image" && (
                  <div className="flex-shrink-0">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {type === "image" && file.preview ? (
                  <img
                    src={file.preview || "/placeholder.svg"}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                    onLoad={() => URL.revokeObjectURL(file.preview!)}
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>

                  {uploadProgress[file.name] && (
                    <div className="mt-2">
                      <Progress value={uploadProgress[file.name]} className="h-1" />
                      <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress[file.name]}%</p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
