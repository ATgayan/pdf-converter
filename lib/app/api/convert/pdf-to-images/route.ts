import { type NextRequest, NextResponse } from "next/server"
import * as pdfjsLib from "pdfjs-dist"
import JSZip from "jszip"
import { createCanvas } from "canvas"

pdfjsLib.GlobalWorkerOptions.workerSrc = false

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    // Enhanced validation
    if (!file) {
      return NextResponse.json(
        {
          error: "No file provided",
          code: "NO_FILE",
          details: "Please select a PDF file to convert.",
        },
        { status: 400 },
      )
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Invalid file type",
          code: "INVALID_FILE_TYPE",
          details: `File "${file.name}" is not a PDF. Only PDF files are supported.`,
        },
        { status: 400 },
      )
    }

    const maxFileSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error: "File too large",
          code: "FILE_TOO_LARGE",
          details: `File "${file.name}" (${Math.round(file.size / 1024 / 1024)}MB) exceeds the 50MB limit.`,
        },
        { status: 400 },
      )
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          error: "Empty file",
          code: "EMPTY_FILE",
          details: `File "${file.name}" appears to be empty or corrupted.`,
        },
        { status: 400 },
      )
    }

    // Convert file to array buffer
    let pdfBuffer: ArrayBuffer
    try {
      pdfBuffer = await file.arrayBuffer()
      console.log("[v0] PDF buffer created, size:", pdfBuffer.byteLength)
    } catch (readError) {
      console.error("[v0] File read error:", readError)
      return NextResponse.json(
        {
          error: "File read failed",
          code: "FILE_READ_ERROR",
          details: `Could not read file "${file.name}". The file may be corrupted.`,
        },
        { status: 400 },
      )
    }

    // Load the PDF document
    let pdfDocument: pdfjsLib.PDFDocumentProxy
    try {
      console.log("[v0] Loading PDF document...")
      const loadingTask = pdfjsLib.getDocument({
        data: pdfBuffer,
        useSystemFonts: true,
        disableFontFace: false,
        useWorkerFetch: false,
        isEvalSupported: false,
        disableAutoFetch: true,
        disableStream: true,
      })
      pdfDocument = await loadingTask.promise
      console.log("[v0] PDF loaded successfully, pages:", pdfDocument.numPages)
    } catch (loadError) {
      console.error("[v0] PDF load error:", loadError)
      return NextResponse.json(
        {
          error: "Invalid PDF",
          code: "INVALID_PDF",
          details: `File "${file.name}" is not a valid PDF or is password-protected.`,
        },
        { status: 400 },
      )
    }

    const numPages = pdfDocument.numPages

    if (numPages === 0) {
      return NextResponse.json(
        {
          error: "Empty PDF",
          code: "EMPTY_PDF",
          details: `PDF "${file.name}" contains no pages.`,
        },
        { status: 400 },
      )
    }

    if (numPages > 100) {
      return NextResponse.json(
        {
          error: "Too many pages",
          code: "TOO_MANY_PAGES",
          details: `PDF "${file.name}" has ${numPages} pages. Maximum 100 pages allowed.`,
        },
        { status: 400 },
      )
    }

    const zip = new JSZip()

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      try {
        console.log("[v0] Processing page", pageNum, "of", numPages)
        const page = await pdfDocument.getPage(pageNum)

        // Set up canvas for rendering
        const scale = 2.0 // Higher scale for better quality
        const viewport = page.getViewport({ scale })

        if (viewport.width <= 0 || viewport.height <= 0) {
          throw new Error(`Page ${pageNum} has invalid dimensions`)
        }

        const canvas = createCanvas(viewport.width, viewport.height)
        const context = canvas.getContext("2d")

        if (!context) {
          throw new Error(`Failed to get canvas context for page ${pageNum}`)
        }

        // Fill with white background
        context.fillStyle = "white"
        context.fillRect(0, 0, viewport.width, viewport.height)

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          background: "white",
          intent: "display" as const,
        }

        await page.render(renderContext).promise
        console.log("[v0] Page", pageNum, "rendered successfully")

        const imageBuffer = canvas.toBuffer("image/png")

        if (imageBuffer.length === 0) {
          throw new Error(`Page ${pageNum} generated an empty image`)
        }

        // Add image to zip
        zip.file(`page-${pageNum.toString().padStart(3, "0")}.png`, imageBuffer)
        console.log("[v0] Page", pageNum, "added to ZIP, size:", imageBuffer.length)
      } catch (pageError) {
        console.error(`[v0] Error processing page ${pageNum}:`, pageError)
        return NextResponse.json(
          {
            error: "Page processing failed",
            code: "PAGE_PROCESSING_ERROR",
            details: `Failed to process page ${pageNum}: ${pageError instanceof Error ? pageError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // Generate ZIP file
    let zipBuffer: ArrayBuffer
    try {
      console.log("[v0] Generating ZIP file...")
      zipBuffer = await zip.generateAsync({ type: "arraybuffer" })
      console.log("[v0] ZIP generated successfully, size:", zipBuffer.byteLength)
    } catch (zipError) {
      console.error("[v0] ZIP generation error:", zipError)
      return NextResponse.json(
        {
          error: "Archive creation failed",
          code: "ZIP_GENERATION_ERROR",
          details: "Failed to create the ZIP archive. Please try again.",
        },
        { status: 500 },
      )
    }

    if (zipBuffer.byteLength === 0) {
      return NextResponse.json(
        {
          error: "Empty archive",
          code: "EMPTY_ZIP",
          details: "The generated archive is empty.",
        },
        { status: 500 },
      )
    }

    // Return the ZIP file for auto-download
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${file.name.replace(".pdf", "")}-images.zip"`,
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] PDF to images conversion error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("out of memory") || error.message.includes("memory")) {
        return NextResponse.json(
          {
            error: "Out of memory",
            code: "OUT_OF_MEMORY",
            details: "The PDF is too large to process. Please try with a smaller file.",
          },
          { status: 413 },
        )
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            error: "Processing timeout",
            code: "TIMEOUT",
            details: "The conversion took too long. Please try with a smaller PDF.",
          },
          { status: 408 },
        )
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        details: "An unexpected error occurred during conversion. Please try again.",
      },
      { status: 500 },
    )
  }
}
