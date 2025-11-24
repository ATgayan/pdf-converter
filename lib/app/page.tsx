import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, FilePen as FilePdf, Zap, Shield, Download, Upload } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Banner Image Section */}
        <div className="relative mb-16 rounded-2xl overflow-hidden">
          <img
            src="/modern-office-workspace-with-documents-and-digital.png"
            alt="Professional file conversion workspace"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Professional File Converter</h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty">
                Convert images to PDF or extract images from PDF files with ease
              </p>
            </div>
          </div>
        </div>

        {/* Updated Button Section */}
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/converter">
                <FileImage className="w-5 h-5 mr-2" />
                Image to PDF
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/converter">
                <FilePdf className="w-5 h-5 mr-2" />
                PDF to Images
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Images to PDF</CardTitle>
              <CardDescription>Convert multiple images into a single, professional PDF document</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FilePdf className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>PDF to Images</CardTitle>
              <CardDescription>Extract individual pages from PDF files as high-quality images</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Optimized conversion algorithms for quick processing of large files</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>Your files are processed securely and never stored on our servers</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Drag & Drop</CardTitle>
              <CardDescription>Simple drag-and-drop interface with instant file preview</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Instant Download</CardTitle>
              <CardDescription>Download your converted files immediately with one click</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Convert Your Files?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust our converter for their daily file conversion needs.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/converter">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
