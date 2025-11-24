import { type NextRequest, NextResponse } from "next/server"
import { PDFDocument } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    // Enhanced validation
    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          error: "No files provided",
          code: "NO_FILES",
          details: "Please select at least one image file to convert.",
        },
        { status: 400 },
      )
    }

    if (files.length > 10) {
      return NextResponse.json(
        {
          error: "Too many files",
          code: "TOO_MANY_FILES",
          details: "Maximum 10 files allowed per conversion.",
        },
        { status: 400 },
      )
    }

    // Validate file types and sizes
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    const maxFileSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Invalid file type: ${file.type}`,
            code: "INVALID_FILE_TYPE",
            details: `File "${file.name}" is not a supported image format. Only JPG and PNG files are allowed.`,
          },
          { status: 400 },
        )
      }

      if (file.size > maxFileSize) {
        return NextResponse.json(
          {
            error: "File too large",
            code: "FILE_TOO_LARGE",
            details: `File "${file.name}" (${Math.round(file.size / 1024 / 1024)}MB) exceeds the 10MB limit.`,
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
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()

    // Process each image file with enhanced error handling
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      try {
        const imageBytes = await file.arrayBuffer()

        if (imageBytes.byteLength === 0) {
          throw new Error(`File "${file.name}" could not be read or is empty`)
        }

        let image
        try {
          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await pdfDoc.embedJpg(imageBytes)
          } else if (file.type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes)
          }
        } catch (embedError) {
          throw new Error(
            `File "${file.name}" appears to be corrupted or is not a valid ${file.type.split("/")[1].toUpperCase()} image`,
          )
        }

        if (image) {
          // Calculate dimensions to fit the page while maintaining aspect ratio
          const { width, height } = image

          if (width <= 0 || height <= 0) {
            throw new Error(`File "${file.name}" has invalid dimensions`)
          }

          const maxWidth = 595.28 // A4 width in points
          const maxHeight = 841.89 // A4 height in points

          let scaledWidth = width
          let scaledHeight = height

          // Scale down if image is larger than page
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width
            const heightRatio = maxHeight / height
            const scale = Math.min(widthRatio, heightRatio)

            scaledWidth = width * scale
            scaledHeight = height * scale
          }

          // Add a new page and draw the image
          const page = pdfDoc.addPage([maxWidth, maxHeight])
          const x = (maxWidth - scaledWidth) / 2
          const y = (maxHeight - scaledHeight) / 2

          page.drawImage(image, {
            x,
            y,
            width: scaledWidth,
            height: scaledHeight,
          })
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        return NextResponse.json(
          {
            error: "File processing failed",
            code: "FILE_PROCESSING_ERROR",
            details: fileError instanceof Error ? fileError.message : `Failed to process file "${file.name}"`,
          },
          { status: 400 },
        )
      }
    }

    // Serialize the PDF document
    let pdfBytes: Uint8Array
    try {
      pdfBytes = await pdfDoc.save()
    } catch (saveError) {
      console.error("PDF save error:", saveError)
      return NextResponse.json(
        {
          error: "PDF generation failed",
          code: "PDF_SAVE_ERROR",
          details: "Failed to generate the final PDF document. Please try with fewer or smaller images.",
        },
        { status: 500 },
      )
    }

    if (pdfBytes.length === 0) {
      return NextResponse.json(
        {
          error: "Empty PDF generated",
          code: "EMPTY_PDF",
          details: "The generated PDF is empty. Please check your image files.",
        },
        { status: 500 },
      )
    }

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted-images.pdf"',
        "Content-Length": pdfBytes.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF conversion error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("out of memory") || error.message.includes("memory")) {
        return NextResponse.json(
          {
            error: "Out of memory",
            code: "OUT_OF_MEMORY",
            details: "The files are too large to process. Please try with smaller images or fewer files.",
          },
          { status: 413 },
        )
      }

      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            error: "Processing timeout",
            code: "TIMEOUT",
            details: "The conversion took too long. Please try with smaller files.",
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
