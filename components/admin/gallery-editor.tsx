"use client"

import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Filter, Grid, List, Save, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  url: string
  title: string
  category: string
  tags: string[]
  uploadDate: string
}

const categories = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Commercial", "Exterior"]

export function GalleryEditor() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()

      // Transform frontend gallery structure to admin structure
      const galleryImages = (data.gallery || []).map((item: any, index: number) => ({
        id: `img-${index}`,
        url: item.image,
        title: item.caption,
        category: "Living Room", // Default category
        tags: [],
        uploadDate: new Date().toISOString(),
      }))

      setImages(galleryImages)
    } catch (error) {
      toast.error("Failed to load gallery")
    } finally {
      setIsLoading(false)
    }
  }

  const saveGallery = async () => {
    setIsSaving(true)
    try {
      // Transform gallery data to match frontend structure
      const galleryData = images.map((img) => ({
        image: img.url,
        caption: img.title || img.category,
      }))

      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gallery: galleryData }),
      })

      if (response.ok) {
        toast.success("Gallery updated successfully!")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast.error("Failed to save gallery")
    } finally {
      setIsSaving(false)
    }
  }

  const addImage = (imageUrl: string) => {
    const newImage: GalleryImage = {
      id: `img-${Date.now()}`,
      url: imageUrl,
      title: "",
      category: "Living Room",
      tags: [],
      uploadDate: new Date().toISOString(),
    }
    setImages([newImage, ...images])
  }

  const updateImage = (id: string, field: keyof GalleryImage, value: any) => {
    setImages(images.map((image) => (image.id === id ? { ...image, [field]: value } : image)))
  }

  const deleteImage = (id: string) => {
    setImages(images.filter((image) => image.id !== id))
  }

  const updateTags = (id: string, tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    updateImage(id, "tags", tags)
  }

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading gallery...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gallery Images ({images.length})</h2>
        <div className="flex gap-2">
          <Button onClick={saveGallery} disabled={isSaving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#FF4500]" />
            Upload New Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload onUpload={addImage} accept="image/*" maxSize={10 * 1024 * 1024} multiple />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredImages.map((image) => (
          <Card key={image.id}>
            {viewMode === "grid" ? (
              <>
                <div className="relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => deleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4 space-y-3">
                  <Input
                    value={image.title}
                    onChange={(e) => updateImage(image.id, "title", e.target.value)}
                    placeholder="Image title"
                  />
                  <select
                    value={image.category}
                    onChange={(e) => updateImage(image.id, "category", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={image.tags.join(", ")}
                    onChange={(e) => updateTags(image.id, e.target.value)}
                    placeholder="Tags (comma separated)"
                  />
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={image.title}
                      onChange={(e) => updateImage(image.id, "title", e.target.value)}
                      placeholder="Image title"
                    />
                    <div className="flex gap-2">
                      <select
                        value={image.category}
                        onChange={(e) => updateImage(image.id, "category", e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <Button variant="destructive" size="sm" onClick={() => deleteImage(image.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={image.tags.join(", ")}
                      onChange={(e) => updateTags(image.id, e.target.value)}
                      placeholder="Tags (comma separated)"
                    />
                    <div className="flex gap-1">
                      {image.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {images.length === 0 ? "No images uploaded yet" : "No images match your filters"}
            </p>
            {images.length === 0 && <p className="text-sm text-gray-400">Upload your first image to get started</p>}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
