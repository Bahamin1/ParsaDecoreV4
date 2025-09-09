"use client"

import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Edit, Eye, FolderOpen, Plus, Save, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Project {
  client: string | number | readonly string[] | undefined
  location: string | number | readonly string[] | undefined
  featured: boolean | undefined
  id: string
  title: string
  category: string
  description: string
  images: string[]
  materials: string[]
  specs: {
    area: string
    duration: string
    year: string
  }
}

const categories = ["residential", "commercial", "small-rooms"]

export function PortfolioEditor() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setProjects(data.portfolio || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveProjects = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Portfolio updated successfully!",
        })
        setEditingProject(null)
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save portfolio",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: "",
      category: "residential",
      description: "",
      images: [],
      materials: [],
      specs: {
        area: "",
        duration: "",
        year: new Date().getFullYear().toString(),
      },
      client: undefined,
      location: undefined,
      featured: undefined
    }
    setProjects([...projects, newProject])
    setEditingProject(newProject.id)
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    if (editingProject === id) setEditingProject(null)
  }

  const addImageToProject = (projectId: string, imageUrl: string) => {
    updateProject(projectId, "images", [...(projects.find((p) => p.id === projectId)?.images || []), imageUrl])
  }

  const removeImageFromProject = (projectId: string, imageIndex: number) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const newImages = project.images.filter((_, i) => i !== imageIndex)
      updateProject(projectId, "images", newImages)
    }
  }

  const addMaterial = (projectId: string, material: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project && material.trim()) {
      updateProject(projectId, "materials", [...project.materials, material.trim()])
    }
  }

  const removeMaterial = (projectId: string, materialIndex: number) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const newMaterials = project.materials.filter((_, i) => i !== materialIndex)
      updateProject(projectId, "materials", newMaterials)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading portfolio...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Portfolio Projects ({projects.length})</h2>
        <div className="flex gap-2">
          <Button onClick={addProject} className="bg-[#FF4500] hover:bg-[#E63E00]">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
          <Button onClick={saveProjects} disabled={isSaving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-[#FF4500]" />
                  <div>
                    <CardTitle className="text-lg">{project.title || "Untitled Project"}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {project.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                      {project.featured && <Badge className="bg-[#FF4500]">Featured</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingProject(editingProject === project.id ? null : project.id)}
                  >
                    {editingProject === project.id ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {editingProject === project.id && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Project Title</label>
                    <Input
                      value={project.title}
                      onChange={(e) => updateProject(project.id, "title", e.target.value)}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={project.category}
                      onChange={(e) => updateProject(project.id, "category", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Area</label>
                    <Input
                      value={project.specs.area}
                      onChange={(e) => updateProject(project.id, "specs", { ...project.specs, area: e.target.value })}
                      placeholder="e.g., 2,500 sq ft"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Input
                      value={project.specs.duration}
                      onChange={(e) =>
                        updateProject(project.id, "specs", { ...project.specs, duration: e.target.value })
                      }
                      placeholder="e.g., 4 months"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Year Completed</label>
                    <Input
                      value={project.specs.year}
                      onChange={(e) => updateProject(project.id, "specs", { ...project.specs, year: e.target.value })}
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Client</label>
                    <Input
                      value={project.client}
                      onChange={(e) => updateProject(project.id, "client", e.target.value)}
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input
                      value={project.location}
                      onChange={(e) => updateProject(project.id, "location", e.target.value)}
                      placeholder="Project location"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`featured-${project.id}`}
                      checked={project.featured}
                      onChange={(e) => updateProject(project.id, "featured", e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor={`featured-${project.id}`} className="text-sm font-medium">
                      Featured Project
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    placeholder="Project description and details"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Project Images</label>
                  <ImageUpload
                    onUpload={(url) => addImageToProject(project.id, url)}
                    accept="image/*"
                    maxSize={5 * 1024 * 1024}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {project.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImageFromProject(project.id, index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Materials Used</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add material (e.g., Italian marble)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addMaterial(project.id, e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addMaterial(project.id, input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {material}
                        <button
                          onClick={() => removeMaterial(project.id, index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <Button onClick={addProject} className="bg-[#FF4500] hover:bg-[#E63E00]">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
