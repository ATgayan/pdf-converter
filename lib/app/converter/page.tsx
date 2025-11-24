import { ConversionTabs } from "@/components/conversion-tabs"

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">File Converter</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Convert your files between different formats with ease
          </p>
        </div>
        <ConversionTabs />
      </div>
    </div>
  )
}
