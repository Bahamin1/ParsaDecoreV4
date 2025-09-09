import JSZip from "jszip"
import { validateContent } from "./content-validator"
import type { ContentData } from "./content"

export interface ExportOptions {
  includeMedia: boolean
  optimizeImages: boolean
  format: "json" | "typescript"
}

export interface ExportResult {
  success: boolean
  data?: Blob
  filename?: string
  errors?: string[]
}

export class ContentExporter {
  private content: ContentData
  private mediaFiles: Map<string, Blob> = new Map()

  constructor(content: ContentData) {
    this.content = content
  }

  async addMediaFile(url: string, file: Blob) {
    this.mediaFiles.set(url, file)
  }

  async exportContent(
    options: ExportOptions = {
      includeMedia: true,
      optimizeImages: true,
      format: "json",
    },
  ): Promise<ExportResult> {
    try {
      // Validate content before export
      if (!validateContent(this.content)) {
        return {
          success: false,
          errors: ["Content validation failed. Please check all required fields."],
        }
      }

      const zip = new JSZip()
      const timestamp = new Date().toISOString().split("T")[0]

      // Add content file
      const contentString =
        options.format === "typescript" ? this.generateTypeScriptContent() : JSON.stringify(this.content, null, 2)

      const contentFileName = options.format === "typescript" ? "content.ts" : "content.json"

      zip.file(`data/${contentFileName}`, contentString)

      // Add schema file
      const schemaResponse = await fetch("/data/content-schema.json")
      if (schemaResponse.ok) {
        const schema = await schemaResponse.text()
        zip.file("data/content-schema.json", schema)
      }

      // Add media files if requested
      if (options.includeMedia && this.mediaFiles.size > 0) {
        const mediaFolder = zip.folder("public/images")

        for (const [url, file] of this.mediaFiles) {
          const filename = this.extractFilename(url)
          if (options.optimizeImages && this.isImage(filename)) {
            const optimizedFile = await this.optimizeImage(file)
            mediaFolder?.file(filename, optimizedFile)
          } else {
            mediaFolder?.file(filename, file)
          }
        }
      }

      // Add import instructions
      zip.file("IMPORT_INSTRUCTIONS.md", this.generateImportInstructions())

      // Add sync script
      zip.file("scripts/sync-content.js", this.generateSyncScript())

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      return {
        success: true,
        data: zipBlob,
        filename: `parsa-decor-content-${timestamp}.zip`,
      }
    } catch (error) {
      console.error("Export failed:", error)
      return {
        success: false,
        errors: [`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`],
      }
    }
  }

  private generateTypeScriptContent(): string {
    return `// Generated content file - Do not edit manually
// Last updated: ${new Date().toISOString()}

import type { ContentData } from '../lib/content'

export const contentData: ContentData = ${JSON.stringify(this.content, null, 2)} as const

export default contentData
`
  }

  private extractFilename(url: string): string {
    const urlParts = url.split("/")
    const filename = urlParts[urlParts.length - 1]
    return filename.includes(".") ? filename : `${filename}.jpg`
  }

  private isImage(filename: string): boolean {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  private async optimizeImage(file: Blob): Promise<Blob> {
    // In a real implementation, this would use a library like sharp or canvas
    // For now, we'll just return the original file
    return file
  }

  private generateImportInstructions(): string {
    return `# Content Import Instructions

## Overview
This package contains exported content and media from the Parsa Decor admin panel.

## Files Included
- \`data/content.json\` - Main content data
- \`data/content-schema.json\` - Content validation schema
- \`public/images/\` - Optimized media files
- \`scripts/sync-content.js\` - Automated sync script

## Manual Import Steps

1. **Backup Current Content**
   \`\`\`bash
   cp data/content.json data/content.backup.json
   \`\`\`

2. **Extract Content**
   - Copy \`data/content.json\` to your project's \`data/\` directory
   - Copy all files from \`public/images/\` to your project's \`public/images/\` directory

3. **Validate Content**
   \`\`\`bash
   node scripts/validate-content.js
   \`\`\`

4. **Test Locally**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Deploy**
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

## Automated Sync

Run the sync script to automatically import content:

\`\`\`bash
node scripts/sync-content.js path/to/exported/content.zip
\`\`\`

## Troubleshooting

- **Validation Errors**: Check the content schema and ensure all required fields are present
- **Missing Images**: Verify image paths in content.json match the files in public/images/
- **Build Errors**: Run \`npm run lint\` to check for TypeScript errors

## Security Notes

- Never commit sensitive API keys or credentials
- Review all content before deploying to production
- Test thoroughly in a staging environment first
`
  }

  private generateSyncScript(): string {
    return `#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const JSZip = require('jszip')

async function syncContent(zipPath) {
  try {
    console.log('🔄 Starting content sync...')
    
    // Read zip file
    const zipData = fs.readFileSync(zipPath)
    const zip = await JSZip.loadAsync(zipData)
    
    // Extract content.json
    const contentFile = zip.file('data/content.json')
    if (contentFile) {
      const content = await contentFile.async('string')
      fs.writeFileSync('data/content.json', content)
      console.log('✅ Updated content.json')
    }
    
    // Extract images
    const imageFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('public/images/') && !zip.files[name].dir
    )
    
    for (const imagePath of imageFiles) {
      const imageFile = zip.file(imagePath)
      if (imageFile) {
        const imageData = await imageFile.async('nodebuffer')
        const localPath = imagePath
        
        // Ensure directory exists
        const dir = path.dirname(localPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        fs.writeFileSync(localPath, imageData)
        console.log(\`✅ Updated \${imagePath}\`)
      }
    }
    
    console.log('🎉 Content sync completed successfully!')
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

// Get zip path from command line argument
const zipPath = process.argv[2]
if (!zipPath) {
  console.error('Usage: node sync-content.js <path-to-content.zip>')
  process.exit(1)
}

if (!fs.existsSync(zipPath)) {
  console.error(\`File not found: \${zipPath}\`)
  process.exit(1)
}

syncContent(zipPath)
`
  }
}

// Utility functions for admin panel
export async function exportCurrentContent(): Promise<ExportResult> {
  try {
    // In a real app, this would fetch from your CMS/database
    const response = await fetch("/api/admin/content")
    const content = await response.json()

    const exporter = new ContentExporter(content)

    // Add media files (in real app, fetch from your media storage)
    // This is a placeholder - you'd implement actual media fetching

    return await exporter.exportContent({
      includeMedia: true,
      optimizeImages: true,
      format: "json",
    })
  } catch (error) {
    return {
      success: false,
      errors: [`Failed to export content: ${error instanceof Error ? error.message : "Unknown error"}`],
    }
  }
}
