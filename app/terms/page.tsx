import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, AlertTriangle, Shield, FileText, Copyright, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Scale className="h-12 w-12 text-cyan-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Terms of Service</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  Welcome to TD Solution's PDF ↔ Image Converter. By accessing or using our service, you agree to be
                  bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                  These terms apply to all visitors, users, and others who access or use the service.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">
                  TD Solution provides a web-based file conversion service that allows users to:
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li>Convert multiple image files (JPG, PNG) into a single PDF document</li>
                  <li>Convert PDF documents into separate image files (PNG format)</li>
                  <li>Download converted files for personal or professional use</li>
                </ul>
                <p className="text-slate-700">
                  Our service is provided "as is" and we reserve the right to modify, suspend, or discontinue any part
                  of the service at any time without notice.
                </p>
              </CardContent>
            </Card>

            {/* Acceptable Use */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-600" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">You agree to use our service only for lawful purposes. You may NOT:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Upload copyrighted material without permission</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Upload illegal, harmful, or offensive content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Attempt to hack or disrupt our service</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Use automated tools to abuse our service</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Upload malware, viruses, or malicious code</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-700">Violate any applicable laws or regulations</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Important:</strong> You are solely responsible for ensuring you have the right to convert
                    and download any files you upload to our service.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File Handling */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>File Handling and Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">File Processing</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Files are processed temporarily on our servers for conversion purposes only</li>
                    <li>Maximum file size limit: 50MB per file</li>
                    <li>Maximum number of files per conversion: 20 files</li>
                    <li>Supported formats: PDF, JPG, PNG</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Automatic Deletion</h3>
                  <p className="text-slate-700">
                    All uploaded files and converted outputs are automatically deleted from our servers within 24 hours
                    of upload. We do not permanently store your files.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers and Limitations */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-cyan-600" />
                  Disclaimers and Limitations of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Service Accuracy</h3>
                  <p className="text-slate-700">
                    While we strive to provide accurate file conversions, we cannot guarantee that all conversions will
                    be perfect or meet your specific requirements. The quality of converted files may vary depending on
                    the source material.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">No Warranties</h3>
                  <p className="text-slate-700">
                    Our service is provided "as is" without any warranties, express or implied. We disclaim all
                    warranties including merchantability, fitness for a particular purpose, and non-infringement.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Limitation of Liability</h3>
                  <p className="text-slate-700">
                    TD Solution shall not be liable for any indirect, incidental, special, consequential, or punitive
                    damages, including but not limited to loss of profits, data, or use, arising out of your use of our
                    service.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Maximum Liability:</strong> Our total liability to you for any claims arising from the use
                    of our service shall not exceed $100 USD.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copyright className="h-5 w-5 text-cyan-600" />
                  Intellectual Property Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Your Content</h3>
                  <p className="text-slate-700">
                    You retain all rights to the files you upload and convert using our service. By using our service,
                    you grant us a temporary license to process your files solely for conversion purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Our Service</h3>
                  <p className="text-slate-700">
                    The TD Solution website, software, and all related intellectual property are owned by TD Solution
                    and protected by copyright, trademark, and other intellectual property laws.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Third-Party Content</h3>
                  <p className="text-slate-700">
                    Our service may include third-party software or services. All third-party intellectual property
                    rights are acknowledged and respected.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  We may terminate or suspend your access to our service immediately, without prior notice, for any
                  reason, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent, abusive, or illegal activity</li>
                  <li>Technical or security reasons</li>
                </ul>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes
                  by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued
                  use of the service after any changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg bg-slate-900 text-white">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-slate-300">
                  <p>
                    <strong>Email:</strong> legal@tdsolution.com
                  </p>
                  <p>
                    <strong>Address:</strong> TD Solution Legal Department
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card className="shadow-lg border-cyan-200">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600 text-center">
                  These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes
                  arising from these terms will be resolved through binding arbitration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
