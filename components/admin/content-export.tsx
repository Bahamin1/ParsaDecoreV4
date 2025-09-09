"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, FileText, ImageIcon, Code, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportCurrentContent } from "@/lib/content-export"

interface ExportOptions {
  includeMedia: boolean
  optimizeImages: boolean
  format: "json" | "typescript"
}

export function ContentExport() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [options, setOptions] = useState<ExportOptions>({
    includeMedia: true,
    optimizeImages: true,
    format: "json",
  })

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await exportCurrentContent()

      setExportProgress(100)

      if (result.success && result.data && result.filename) {
        // Create download link
        const url = URL.createObjectURL(result.data)
        const a = document.createElement("a")
        a.href = url
        a.download = result.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Export successful",
          description: `Content exported as ${result.filename}`,
        })
      } else {
        throw new Error(result.errors?.join(", ") || "Export failed")
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".zip"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Handle import logic here
        toast({
          title: "Import started",
          description: "Processing uploaded content...",
        })
      }
    }
    input.click()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Content Export & Sync</h2>
        <p className="text-gray-600">Export your content and media for deployment to the frontend repository</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-[#FF4500]" />
              Export Content
            </CardTitle>
            <CardDescription>Download all content and media as a deployable package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Format Selection */}
            <div>
              <Label className="text-base font-medium">Export Format</Label>
              <RadioGroup
                value={options.format}
                onValueChange={(value: "json" | "typescript") => setOptions((prev) => ({ ...prev, format: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON (Recommended)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="typescript" id="typescript" />
                  <Label htmlFor="typescript" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    TypeScript
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Media Options */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Media Options</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMedia"
                  checked={options.includeMedia}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeMedia: !!checked }))}
                />
                <Label htmlFor="includeMedia" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Include media files
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="optimizeImages"
                  checked={options.optimizeImages}
                  onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, optimizeImages: !!checked }))}
                  disabled={!options.includeMedia}
                />
                <Label htmlFor="optimizeImages" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Optimize images for web
                </Label>
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-2">
                <Progress value={exportProgress} className="w-full" />
                <p className="text-sm text-center text-gray-600">Exporting content... {exportProgress}%</p>
              </div>
            )}

            {/* Export Button */}
            <Button onClick={handleExport} disabled={isExporting} className="w-full bg-[#FF4500] hover:bg-[#E63E00]">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Content"}
            </Button>
          </CardContent>
        </Card>

        {/* Import & Sync */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#FF4500]" />
                Import Content
              </CardTitle>
              <CardDescription>Upload and restore content from a previous export</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleImport}
                variant="outline"
                className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#FF4500] bg-transparent"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload content.zip</p>
                  <p className="text-xs text-gray-400">Or drag and drop here</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Sync Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Deployment Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Step 1
                </Badge>
                <p className="text-sm text-gray-600">Export your content using the options above</p>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Step 2
                </Badge>
                <p className="text-sm text-gray-600">Extract the ZIP file to your frontend repository</p>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Step 3
                </Badge>
                <p className="text-sm text-gray-600">Run the sync script or manually copy files</p>
              </div>

              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Step 4
                </Badge>
                <p className="text-sm text-gray-600">Build and deploy your static site</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
