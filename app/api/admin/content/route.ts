import { getContentData } from "@/lib/content"
import { validateContent } from "@/lib/content-validator"
import fs from "fs"
import { type NextRequest, NextResponse } from "next/server"
import path from "path"

// GET /api/admin/content - Fetch current content
export async function GET() {
  try {
    const content = await getContentData()
    return NextResponse.json(content)
  } catch (error) {
    console.error("Failed to fetch content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// POST /api/admin/content - Update content
export async function POST(request: NextRequest) {
  try {
    const content = await request.json()

    // Validate content structure
    if (!validateContent(content)) {
      return NextResponse.json({ error: "Invalid content structure" }, { status: 400 })
    }

    // Write to content file
    const contentPath = path.join(process.cwd(), "data", "content.json")
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

// PATCH /api/admin/content - Handle partial content updates
export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json()

    // Get current content
    const currentContent = await getContentData()

    // Merge updates with current content
    const updatedContent = { ...currentContent, ...updates }

    // Validate content structure
    if (!validateContent(updatedContent)) {
      return NextResponse.json({ error: "Invalid content structure" }, { status: 400 })
    }

    // Write to content file
    const contentPath = path.join(process.cwd(), "data", "content.json")
    fs.writeFileSync(contentPath, JSON.stringify(updatedContent, null, 2))

    return NextResponse.json({ success: true, content: updatedContent })
  } catch (error) {
    console.error("Failed to update content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
