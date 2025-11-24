import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Users, Settings, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-cyan-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Privacy Policy</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-600" />
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p>
                  At TD Solution, we take your privacy seriously. This Privacy Policy explains how we collect, use, and
                  protect your information when you use our PDF to Image and Image to PDF conversion service. We are
                  committed to being transparent about our data practices and ensuring your personal information remains
                  secure.
                </p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Files You Upload</h3>
                  <p className="text-slate-700">
                    We temporarily process the PDF and image files you upload for conversion purposes only. These files
                    are automatically deleted from our servers within 24 hours of upload.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>IP address and browser information</li>
                    <li>Device type and operating system</li>
                    <li>Usage data and conversion statistics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Contact Information</h3>
                  <p className="text-slate-700">
                    When you contact us through our contact form, we collect your name, email address, and message
                    content to respond to your inquiries.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>File Conversion:</strong> To process and convert your uploaded files between PDF and image
                      formats
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Service Improvement:</strong> To analyze usage patterns and improve our conversion tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Customer Support:</strong> To respond to your questions and provide technical assistance
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Security:</strong> To protect against fraud, abuse, and unauthorized access
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Analytics</h3>
                  <p className="text-slate-700">
                    We use Google Analytics to understand how visitors use our website. Google Analytics collects
                    information anonymously and reports website trends without identifying individual visitors.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Advertising</h3>
                  <p className="text-slate-700">
                    We may display advertisements through Google AdSense. Google may use cookies to serve ads based on
                    your prior visits to our website or other websites.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Hosting and Infrastructure</h3>
                  <p className="text-slate-700">
                    Our website is hosted on Vercel, which may collect technical information for service delivery and
                    security purposes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Data Security and Storage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li>All data transmission is encrypted using HTTPS/SSL</li>
                  <li>Uploaded files are automatically deleted within 24 hours</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>Regular security assessments and updates</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-600" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">Under GDPR and other privacy laws, you have the following rights:</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Access and Portability</h4>
                    <p className="text-sm text-slate-600">Request a copy of your personal data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Rectification</h4>
                    <p className="text-sm text-slate-600">Correct inaccurate personal information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Erasure</h4>
                    <p className="text-sm text-slate-600">Request deletion of your personal data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Opt-out</h4>
                    <p className="text-sm text-slate-600">Withdraw consent for data processing</p>
                  </div>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Cookie Management</h4>
                  <p className="text-sm text-cyan-800">
                    You can control cookies through your browser settings. Note that disabling cookies may affect
                    website functionality.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  Contact Us About Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                </p>
                <div className="space-y-2 text-slate-300">
                  <p>
                    <strong>Email:</strong> privacy@tdsolution.com
                  </p>
                  <p>
                    <strong>Address:</strong> TD Solution Privacy Team
                  </p>
                  <p className="text-sm text-slate-400">
                    We will respond to your privacy-related inquiries within 30 days as required by applicable law.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="shadow-lg border-cyan-200">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600 text-center">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
