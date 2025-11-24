"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  FileImage,
  FilePen as FilePdf,
  Shield,
  Zap,
  AlertCircle,
  Settings,
} from "lucide-react"

const faqData = [
  {
    id: 1,
    category: "conversion",
    icon: <FileImage className="h-4 w-4" />,
    question: "How do I convert images to PDF?",
    answer:
      "Simply go to our Converter page, select the 'Image to PDF' tab, drag and drop your images (JPG or PNG), arrange them in your preferred order, and click 'Convert to PDF'. Your PDF will be automatically generated and downloaded.",
  },
  {
    id: 2,
    category: "conversion",
    icon: <FilePdf className="h-4 w-4" />,
    question: "How do I convert PDF to images?",
    answer:
      "Navigate to the 'PDF to Images' tab on our Converter page, upload your PDF file, and click 'Convert to Images'. Each page of your PDF will be converted to a separate PNG image and packaged in a ZIP file for download.",
  },
  {
    id: 3,
    category: "formats",
    icon: <Settings className="h-4 w-4" />,
    question: "What file formats are supported?",
    answer:
      "For image to PDF conversion, we support JPG and PNG formats. For PDF to image conversion, we accept PDF files and convert them to high-quality PNG images. All conversions maintain the original quality as much as possible.",
  },
  {
    id: 4,
    category: "limits",
    icon: <Zap className="h-4 w-4" />,
    question: "What are the file size and quantity limits?",
    answer:
      "You can upload up to 20 files per conversion with a maximum file size of 50MB each. For PDF files, there's no limit on the number of pages, but the total file size must not exceed 50MB.",
  },
  {
    id: 5,
    category: "security",
    icon: <Shield className="h-4 w-4" />,
    question: "Is my data safe and private?",
    answer:
      "All uploaded files are processed securely using HTTPS encryption and are automatically deleted from our servers within 24 hours. We never store your files permanently or share them with third parties.",
  },
  {
    id: 6,
    category: "security",
    icon: <Shield className="h-4 w-4" />,
    question: "Do you store my converted files?",
    answer:
      "No, we do not store your files. All uploaded documents and converted outputs are automatically deleted from our servers within 24 hours of upload. This ensures your privacy and keeps our service secure.",
  },
  {
    id: 7,
    category: "troubleshooting",
    icon: <AlertCircle className="h-4 w-4" />,
    question: "Why is my conversion taking so long?",
    answer:
      "Conversion time depends on file size, number of files, and current server load. Large files or many images may take longer to process. If a conversion takes more than 5 minutes, try refreshing the page and uploading smaller files or fewer files at once.",
  },
  {
    id: 8,
    category: "troubleshooting",
    icon: <AlertCircle className="h-4 w-4" />,
    question: "What should I do if my conversion fails?",
    answer:
      "If a conversion fails, first check that your files are in supported formats (JPG, PNG, PDF) and under 50MB. Try refreshing the page and uploading again. If the problem persists, contact our support team through the Contact page.",
  },
  {
    id: 9,
    category: "features",
    icon: <Settings className="h-4 w-4" />,
    question: "Can I rearrange the order of images before converting to PDF?",
    answer:
      "Yes! In the Image to PDF section, you can drag and drop images to reorder them before conversion. Simply click and drag the grip handle next to each image to arrange them in your preferred sequence.",
  },
  {
    id: 10,
    category: "troubleshooting",
    icon: <AlertCircle className="h-4 w-4" />,
    question: "Why can't I upload my file?",
    answer:
      "Common reasons include: unsupported file format (we only accept JPG, PNG, and PDF), file size exceeding 50MB, or uploading more than 20 files at once. Check your file format and size, then try again.",
  },
]

const categories = [
  { id: "all", name: "All Questions", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "conversion", name: "Conversion Process", icon: <FileImage className="h-4 w-4" /> },
  { id: "formats", name: "File Formats", icon: <Settings className="h-4 w-4" /> },
  { id: "limits", name: "Limits & Restrictions", icon: <Zap className="h-4 w-4" /> },
  { id: "security", name: "Privacy & Security", icon: <Shield className="h-4 w-4" /> },
  { id: "troubleshooting", name: "Troubleshooting", icon: <AlertCircle className="h-4 w-4" /> },
  { id: "features", name: "Features", icon: <Settings className="h-4 w-4" /> },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<number[]>([])

  const filteredFAQs = selectedCategory === "all" ? faqData : faqData.filter((faq) => faq.category === selectedCategory)

  const toggleItem = (id: number) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <HelpCircle className="h-12 w-12 text-cyan-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Frequently Asked Questions</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
              Find quick answers to common questions about our PDF ↔ Image converter. Can't find what you're looking
              for? Contact our support team.
            </p>
          </div>

          {/* Category Filter */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Browse by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="shadow-lg">
                <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                      <CardTitle className="flex items-center justify-between text-left">
                        <div className="flex items-center gap-3">
                          <div className="text-cyan-600">{faq.icon}</div>
                          <span className="text-slate-900">{faq.question}</span>
                        </div>
                        <div className="text-slate-400">
                          {openItems.includes(faq.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="pl-7">
                        <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <Card className="shadow-lg">
              <CardContent className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions found</h3>
                <p className="text-slate-600">Try selecting a different category or contact our support team.</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Support */}
          <Card className="shadow-lg mt-12 bg-cyan-50 border-cyan-200">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-cyan-900 mb-2">Still need help?</h3>
              <p className="text-cyan-800 mb-4">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                <a href="/contact">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
