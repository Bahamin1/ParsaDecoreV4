import { NextResponse } from "next/server"
import { getContentData } from "@/lib/content"
import { ContentExporter } from "@/lib/content-export"

export async function GET() {
  try {
    const content = await getContentData()
    const exporter = new ContentExporter(content)

    const result = await exporter.exportContent({
      includeMedia: true,
      optimizeImages: true,
      format: "json",
    })

    if (!result.success || !result.data) {
      return NextResponse.json({ error: "Export failed" }, { status: 500 })
    }

    return new NextResponse(result.data, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    })
  } catch (error) {
    console.error("Export failed:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
