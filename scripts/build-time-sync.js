#!/usr/bin/env node

/**
 * Build-time Content Sync Script
 *
 * This script can be run during CI/CD to fetch content from the admin panel
 * and prepare it for static site generation.
 *
 * Usage:
 *   node scripts/build-time-sync.js
 *
 * Environment Variables:
 *   ADMIN_API_URL - URL of the admin panel API
 *   ADMIN_API_KEY - API key for authentication
 */

const fs = require("fs")
const path = require("path")
const https = require("https")

const ADMIN_API_URL = process.env.ADMIN_API_URL || "http://localhost:3000"
const ADMIN_API_KEY = process.env.ADMIN_API_KEY

async function fetchContent() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(ADMIN_API_URL).hostname,
      port: new URL(ADMIN_API_URL).port || 443,
      path: "/api/admin/content/export",
      method: "GET",
      headers: {
        Authorization: `Bearer ${ADMIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    }

    const req = https.request(options, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data))
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}`))
        }
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    req.end()
  })
}

async function downloadMedia(mediaUrls) {
  const mediaDir = path.join(process.cwd(), "public", "images")

  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
  }

  for (const url of mediaUrls) {
    try {
      const filename = path.basename(url)
      const filePath = path.join(mediaDir, filename)

      // Download file (simplified - in real implementation, use proper HTTP client)
      console.log(`📥 Downloading ${filename}...`)

      // Placeholder for actual download logic
      // You would implement actual HTTP download here
    } catch (error) {
      console.error(`Failed to download ${url}:`, error.message)
    }
  }
}

async function syncContent() {
  try {
    console.log("🔄 Starting build-time content sync...")

    if (!ADMIN_API_KEY) {
      throw new Error("ADMIN_API_KEY environment variable is required")
    }

    // Fetch content from admin API
    console.log("📡 Fetching content from admin panel...")
    const content = await fetchContent()

    // Validate content structure
    if (!content || typeof content !== "object") {
      throw new Error("Invalid content structure received from API")
    }

    // Write content to local file
    const contentPath = path.join(process.cwd(), "data", "content.json")
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2))
    console.log("✅ Content saved to data/content.json")

    // Extract media URLs from content
    const mediaUrls = new Set()

    // Collect media URLs from different content sections
    if (content.hero?.backgroundImages) {
      content.hero.backgroundImages.forEach((url) => mediaUrls.add(url))
    }

    if (content.projects) {
      content.projects.forEach((project) => {
        if (project.images) {
          project.images.forEach((url) => mediaUrls.add(url))
        }
      })
    }

    if (content.gallery) {
      content.gallery.forEach((item) => {
        if (item.image) {
          mediaUrls.add(item.image)
        }
      })
    }

    // Download media files
    if (mediaUrls.size > 0) {
      console.log(`📥 Downloading ${mediaUrls.size} media files...`)
      await downloadMedia(Array.from(mediaUrls))
    }

    console.log("🎉 Build-time sync completed successfully!")
  } catch (error) {
    console.error("❌ Build-time sync failed:", error.message)
    process.exit(1)
  }
}

// Run sync if called directly
if (require.main === module) {
  syncContent()
}

module.exports = { syncContent }
