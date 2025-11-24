"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileTextIcon, Download } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { ConversionProgress } from "@/components/conversion-progress"
import { DownloadManager, type DownloadItem } from "@/components/download-manager"
import { ErrorDisplay } from "@/components/error-display"
import { ErrorBoundary } from "@/components/error-boundary"
import { useToast } from "@/hooks/use-toast"

interface FileWithPreview extends File {
  preview?: string
}

interface ConversionStep {
  id: string
  label: string
  status: "pending" | "processing" | "completed" | "error"
}

interface ApiError {
  error: string
  code?: string
  details?: string
}

export function ConversionTabs() {
  const [activeTab, setActiveTab] = useState("image-to-pdf")
  const [imageFiles, setImageFiles] = useState<FileWithPreview[]>([])
  const [pdfFiles, setPdfFiles] = useState<FileWithPreview[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [currentError, setCurrentError] = useState<string | null>(null)
  const { toast } = useToast()

  const updateStepStatus = (stepId: string, status: ConversionStep["status"]) => {
    setConversionSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
  }

  const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      // Handle network errors
      if (error.message.includes("Failed to fetch")) {
        return "Connection failed. Please check your internet connection and try again."
      }
      return error.message
    }

    if (typeof error === "string") {
      return error
    }

    return "An unexpected error occurred. Please try again."
  }

  const parseApiError = async (response: Response): Promise<string> => {
    try {
      const errorData: ApiError = await response.json()
      return errorData.details || errorData.error || `Server error (${response.status})`
    } catch {
      return `Server error (${response.status}): ${response.statusText}`
    }
  }

  const addDownload = (filename: string, blob: Blob) => {
    const downloadItem: DownloadItem = {
      id: Date.now().toString(),
      filename,
      status: "completed",
      progress: 100,
      blob,
      createdAt: new Date(),
    }
    setDownloads((prev) => [downloadItem, ...prev])
    return downloadItem.id
  }

  const updateDownloadStatus = (id: string, status: DownloadItem["status"], progress?: number, error?: string) => {
    setDownloads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, progress: progress ?? item.progress, error } : item)),
    )
  }

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id))
  }

  const retryDownload = async (id: string) => {
    const downloadItem = downloads.find((item) => item.id === id)
    if (!downloadItem) return

    // Reset status and retry the conversion based on the filename
    updateDownloadStatus(id, "pending", 0)

    if (downloadItem.filename.endsWith(".pdf")) {
      // Retry image to PDF conversion
      await handleImageToPdfConvert()
    } else if (downloadItem.filename.endsWith(".zip")) {
      // Retry PDF to images conversion
      await handlePdfToImageConvert()
    }
  }

  const handleDownload = (id: string) => {
    // Mark as downloaded (could track download history here)
    updateDownloadStatus(id, "completed")
  }

  const generateFilename = (type: "pdf" | "zip", originalName?: string) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-")

    if (type === "pdf") {
      return `converted-images-${timestamp}.pdf`
    } else {
      const baseName = originalName?.replace(".pdf", "") || "converted-pdf"
      return `${baseName}-images-${timestamp}.zip`
    }
  }

  const handleImageToPdfConvert = async () => {
    if (imageFiles.length === 0) return

    setIsConverting(true)
    setCurrentProgress(0)
    setCurrentError(null)

    const steps: ConversionStep[] = [
      { id: "validate", label: "Validating images...", status: "pending" },
      { id: "process", label: `Processing ${imageFiles.length} images...`, status: "pending" },
      { id: "create", label: "Creating PDF document...", status: "pending" },
      { id: "prepare", label: "Preparing download...", status: "pending" },
    ]
    setConversionSteps(steps)

    try {
      // Step 1: Validation
      updateStepStatus("validate", "processing")
      await new Promise((resolve) => setTimeout(resolve, 500))
      updateStepStatus("validate", "completed")
      setCurrentProgress(25)

      // Step 2: Process images
      updateStepStatus("process", "processing")
      const formData = new FormData()
      imageFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/convert/images-to-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorMessage = await parseApiError(response)
        throw new Error(errorMessage)
      }

      updateStepStatus("process", "completed")
      setCurrentProgress(50)

      // Step 3: Create PDF
      updateStepStatus("create", "processing")
      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error("The generated PDF is empty. Please check your image files.")
      }

      updateStepStatus("create", "completed")
      setCurrentProgress(75)

      // Step 4: Prepare download
      updateStepStatus("prepare", "processing")
      const filename = generateFilename("pdf")
      const downloadId = addDownload(filename, blob)
      updateStepStatus("prepare", "completed")
      setCurrentProgress(100)

      toast({
        title: "Success!",
        description: `Successfully converted ${imageFiles.length} images to PDF. Check the downloads section.`,
      })

      // Reset after success
      setTimeout(() => {
        setImageFiles([])
        setConversionSteps([])
        setCurrentProgress(0)
      }, 2000)
    } catch (error) {
      console.error("Conversion error:", error)
      const errorMessage = handleApiError(error)
      setCurrentError(errorMessage)

      setConversionSteps((prev) =>
        prev.map((step) => (step.status === "processing" ? { ...step, status: "error" } : step)),
      )

      toast({
        title: "Conversion Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handlePdfToImageConvert = async () => {
    if (pdfFiles.length === 0) return

    setIsConverting(true)
    setCurrentProgress(0)
    setCurrentError(null)

    const steps: ConversionStep[] = [
      { id: "validate", label: "Validating PDF file...", status: "pending" },
      { id: "extract", label: "Extracting pages from PDF...", status: "pending" },
      { id: "convert", label: "Converting pages to images...", status: "pending" },
      { id: "package", label: "Creating ZIP archive...", status: "pending" },
      { id: "prepare", label: "Preparing download...", status: "pending" },
    ]
    setConversionSteps(steps)

    try {
      // Step 1: Validation
      updateStepStatus("validate", "processing")
      await new Promise((resolve) => setTimeout(resolve, 500))
      updateStepStatus("validate", "completed")
      setCurrentProgress(20)

      // Step 2: Extract pages
      updateStepStatus("extract", "processing")
      await new Promise((resolve) => setTimeout(resolve, 800))
      updateStepStatus("extract", "completed")
      setCurrentProgress(40)

      // Step 3: Convert to images
      updateStepStatus("convert", "processing")
      const formData = new FormData()
      formData.append("file", pdfFiles[0])

      const response = await fetch("/api/convert/pdf-to-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorMessage = await parseApiError(response)
        throw new Error(errorMessage)
      }

      updateStepStatus("convert", "completed")
      setCurrentProgress(60)

      // Step 4: Package
      updateStepStatus("package", "processing")
      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error("The generated ZIP archive is empty.")
      }

      updateStepStatus("package", "completed")
      setCurrentProgress(80)

      // Step 5: Prepare download
      updateStepStatus("prepare", "processing")
      const filename = generateFilename("zip", pdfFiles[0].name)
      const downloadId = addDownload(filename, blob)
      updateStepStatus("prepare", "completed")
      setCurrentProgress(100)

      toast({
        title: "Success!",
        description: "Successfully converted PDF to images. Check the downloads section.",
      })

      // Reset after success
      setTimeout(() => {
        setPdfFiles([])
        setConversionSteps([])
        setCurrentProgress(0)
      }, 2000)
    } catch (error) {
      console.error("Conversion error:", error)
      const errorMessage = handleApiError(error)
      setCurrentError(errorMessage)

      setConversionSteps((prev) =>
        prev.map((step) => (step.status === "processing" ? { ...step, status: "error" } : step)),
      )

      toast({
        title: "Conversion Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const retryConversion = () => {
    setCurrentError(null)
    if (activeTab === "image-to-pdf") {
      handleImageToPdfConvert()
    } else {
      handlePdfToImageConvert()
    }
  }

  const dismissError = () => {
    setCurrentError(null)
  }

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto space-y-6">
        {currentError && <ErrorDisplay error={currentError} onRetry={retryConversion} onDismiss={dismissError} />}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="image-to-pdf" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image to PDF
            </TabsTrigger>
            <TabsTrigger value="pdf-to-image" className="flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              PDF to Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image-to-pdf">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Convert Images to PDF
                  </CardTitle>
                  <CardDescription>
                    Upload multiple images (JPG, PNG) and convert them into a single PDF document.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload
                    accept={{
                      "image/jpeg": [".jpg", ".jpeg"],
                      "image/png": [".png"],
                    }}
                    maxFiles={10}
                    maxSize={10485760} // 10MB
                    onFilesChange={setImageFiles}
                    type="image"
                  />

                  {imageFiles.length > 0 && !isConverting && (
                    <div className="flex justify-center">
                      <Button onClick={handleImageToPdfConvert} size="lg" className="min-w-[200px]">
                        <Download className="w-4 h-4 mr-2" />
                        Convert to PDF
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <ConversionProgress
                steps={conversionSteps}
                currentProgress={currentProgress}
                isVisible={isConverting && activeTab === "image-to-pdf"}
              />
            </div>
          </TabsContent>

          <TabsContent value="pdf-to-image">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="w-5 h-5" />
                    Convert PDF to Images
                  </CardTitle>
                  <CardDescription>Upload a PDF file and extract each page as separate image files.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload
                    accept={{
                      "application/pdf": [".pdf"],
                    }}
                    maxFiles={1}
                    maxSize={52428800} // 50MB
                    onFilesChange={setPdfFiles}
                    type="pdf"
                  />

                  {pdfFiles.length > 0 && !isConverting && (
                    <div className="flex justify-center">
                      <Button onClick={handlePdfToImageConvert} size="lg" className="min-w-[200px]">
                        <Download className="w-4 h-4 mr-2" />
                        Convert to Images
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <ConversionProgress
                steps={conversionSteps}
                currentProgress={currentProgress}
                isVisible={isConverting && activeTab === "pdf-to-image"}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DownloadManager
          downloads={downloads}
          onRetry={retryDownload}
          onRemove={removeDownload}
          onDownload={handleDownload}
        />
      </div>
    </ErrorBoundary>
  )
}
