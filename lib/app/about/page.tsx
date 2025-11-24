import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Zap, Shield, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">About TD Solution</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            At TD Solution, our goal is to create tools that are simple, fast, and accessible for everyone—whether
            you're a student, teacher, government employee, or professional. Our PDF to Image and Image to PDF converter
            is designed to make document management easier and more efficient, so you can focus on what matters most.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                TD Solution was founded with a clear vision: document conversion should be effortless and accessible to
                all. We understand that students need to convert research materials, teachers require quick document
                formatting, government employees handle various file types daily, and professionals need reliable tools
                for their workflow.
              </p>
              <p>
                Our converter is built with modern web technologies and optimized for performance, handling your files
                entirely in your browser - ensuring complete privacy and security while delivering fast, professional
                results.
              </p>
              <p>
                We believe that powerful tools shouldn't be complicated or expensive. That's why we've created a
                solution that works instantly, requires no registration, and maintains the highest standards of quality
                and reliability.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Privacy First</CardTitle>
                    <CardDescription>Your files never leave your device</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Lightning Fast</CardTitle>
                    <CardDescription>Optimized for speed and efficiency</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Always Available</CardTitle>
                    <CardDescription>Works anywhere, anytime in your browser</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose TD Solution?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Registration</h3>
              <p className="text-muted-foreground">
                Start converting immediately without creating accounts or providing personal information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Everyone</h3>
              <p className="text-muted-foreground">
                Designed for students, teachers, government employees, and professionals across all industries.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple & Efficient</h3>
              <p className="text-muted-foreground">
                Focus on what matters most while we handle your document conversion needs seamlessly.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-muted/50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Built for Reliability</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            TD Solution leverages cutting-edge technologies to deliver fast, secure, and reliable document conversion.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">Next.js 14</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">PDF-lib</Badge>
            <Badge variant="secondary">Canvas API</Badge>
            <Badge variant="secondary">Serverless</Badge>
            <Badge variant="secondary">Privacy-First</Badge>
          </div>
        </div>
      </div>
    </main>
  )
}
