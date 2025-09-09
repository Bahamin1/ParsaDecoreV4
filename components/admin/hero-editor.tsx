"use client"

import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Play, Save, X } from "lucide-react"
import { useEffect, useState } from "react"

interface HeroData {
  title: string
  tagline: string
  description: string
  videoUrl: string
  backgroundImages: string[]
}

export function HeroEditor() {
  const { toast } = useToast()
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Parsa Decor",
    tagline: "Interior Design and Decor",
    description: "Transforming spaces into extraordinary experiences with premium interior design solutions",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    backgroundImages: [],
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/admin/content")
        if (response.ok) {
          const content = await response.json()
          if (content.hero) {
            setHeroData(content.hero)
          }
        }
      } catch (error) {
        console.error("Failed to load content:", error)
      }
    }
    loadContent()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/content")
      const currentContent = await response.json()

      const updatedContent = {
        ...currentContent,
        hero: heroData,
      }

      const saveResponse = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save")
      }

      toast({
        title: "Hero section updated",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addBackgroundImage = (imageUrl: string) => {
    setHeroData((prev) => ({
      ...prev,
      backgroundImages: [...prev.backgroundImages, imageUrl],
    }))
  }

  const removeBackgroundImage = (index: number) => {
    setHeroData((prev) => ({
      ...prev,
      backgroundImages: prev.backgroundImages.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hero Section</h2>
          <p className="text-gray-600">Manage your homepage hero content and background images</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="bg-[#FF4500] hover:bg-[#E63E00]">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Content Editor */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Edit the main text content for your hero section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={heroData.title}
                  onChange={(e) => setHeroData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter hero title"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={heroData.tagline}
                  onChange={(e) => setHeroData((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Enter tagline"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroData.description}
                  onChange={(e) => setHeroData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter hero description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="videoUrl">Company Video URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="videoUrl"
                    value={heroData.videoUrl}
                    onChange={(e) => setHeroData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="YouTube or Vimeo embed URL"
                  />
                  <Button variant="outline" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Background Images */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Background Images</CardTitle>
              <CardDescription>Upload and manage hero background images (recommended: 1920x1080px)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                onUpload={addBackgroundImage}
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
              />

              <div className="space-y-3">
                {heroData.backgroundImages.map((image, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Background ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Background Image {index + 1}</p>
                      <p className="text-xs text-gray-500">Click to reorder</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBackgroundImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {heroData.backgroundImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No background images uploaded yet.</p>
                    <p className="text-sm">Upload images to create a slideshow effect.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
