"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
}

export function ImageUpload({
  onUpload,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  multiple = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please select a file smaller than ${Math.round(maxSize / 1024 / 1024)}MB`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      setUploadProgress(100)

      setTimeout(() => {
        onUpload(result.url)
        setUploading(false)
        setUploadProgress(0)

        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        })
      }, 500)
    } catch (error) {
      setUploading(false)
      setUploadProgress(0)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
        className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#FF4500] transition-colors"
      >
        <div className="text-center">
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin">
                <Upload className="h-8 w-8 mx-auto text-[#FF4500]" />
              </div>
              <p className="text-sm">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB</p>
            </div>
          )}
        </div>
      </Button>

      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-center text-gray-600">Uploading...</p>
        </div>
      )}
    </div>
  )
}
