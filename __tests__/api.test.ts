import { GET, POST } from "@/app/api/admin/content/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock file system
jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

jest.mock("path", () => ({
  join: jest.fn(() => "/mock/path/content.json"),
}))

describe("Admin API Routes", () => {
  describe("/api/admin/content", () => {
    it("should fetch content successfully", async () => {
      const fs = require("fs")
      fs.readFileSync.mockReturnValue(JSON.stringify({ test: "data" }))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ test: "data" })
    })

    it("should handle fetch errors", async () => {
      const fs = require("fs")
      fs.readFileSync.mockImplementation(() => {
        throw new Error("File not found")
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe("Failed to fetch content")
    })

    it("should update content successfully", async () => {
      const fs = require("fs")
      fs.writeFileSync.mockImplementation(() => {})

      const validContent = {
        hero: {
          title: "Test",
          tagline: "Test",
          description: "Test",
          backgroundImages: ["/test.jpg"],
        },
        services: [],
        colorPalettes: [],
        projects: [],
        gallery: [],
        about: {
          title: "Test",
          description: "Test",
          team: "Test",
          office: {
            address: "Test",
            phone: "Test",
            email: "test@test.com",
            hours: "Test",
          },
        },
      }

      const request = new NextRequest("http://localhost:3000/api/admin/content", {
        method: "POST",
        body: JSON.stringify(validContent),
        headers: { "Content-Type": "application/json" },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})
