import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"

export interface ContentData {
  hero: {
    title: string
    tagline: string
    description: string
    videoUrl: string
    backgroundImages: string[]
  }
  services: Array<{
    id: string
    title: string
    description: string
    icon: string
  }>
  colorPalettes: Array<{
    name: string
    colors: string[]
    useCase: string
    description: string
  }>
  projects: Array<{
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
  }>
  gallery: Array<{
    image: string
    caption: string
  }>
  about: {
    title: string
    description: string
    team: string
    office: {
      address: string
      phone: string
      email: string
      hours: string
    }
  }
}

export async function getContentData(): Promise<ContentData> {
  try {
    const filePath = path.join(process.cwd(), "data", "content.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch (error) {
    console.error("Error loading content data:", error)
    throw new Error("Failed to load content data")
  }
}

export async function getProject(id: string) {
  const data = await getContentData()
  const project = data.projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  return project
}

export async function getProjectsByCategory(category?: string) {
  const data = await getContentData()

  if (!category) {
    return data.projects
  }

  return data.projects.filter((project) => project.category === category)
}

export function getProjectCategories(projects: ContentData["projects"]) {
  const categories = new Set(projects.map((project) => project.category))
  return Array.from(categories)
}
