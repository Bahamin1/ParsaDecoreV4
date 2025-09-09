import { validateContent, getValidationErrors } from "@/lib/content-validator"
import { ContentExporter } from "@/lib/content-export"
import type { ContentData } from "@/lib/content"

describe("Content Management", () => {
  const validContent: ContentData = {
    hero: {
      title: "Test Title",
      tagline: "Test Tagline",
      description: "Test Description",
      videoUrl: "https://youtube.com/test",
      backgroundImages: ["/test1.jpg", "/test2.jpg"],
    },
    services: [
      {
        id: "test-service",
        title: "Test Service",
        description: "Test Description",
        icon: "home",
      },
    ],
    colorPalettes: [
      {
        name: "Test Palette",
        colors: ["#FF0000", "#00FF00"],
        useCase: "Test Use Case",
        description: "Test Description",
      },
    ],
    projects: [
      {
        id: "test-project",
        title: "Test Project",
        category: "residential",
        description: "Test Description",
        images: ["/test.jpg"],
        materials: ["Test Material"],
        specs: {
          area: "1000 sq ft",
          duration: "3 months",
          year: "2024",
        },
      },
    ],
    gallery: [
      {
        image: "/test.jpg",
        caption: "Test Caption",
      },
    ],
    about: {
      title: "Test About",
      description: "Test Description",
      team: "Test Team",
      office: {
        address: "Test Address",
        phone: "+1234567890",
        email: "test@example.com",
        hours: "9-5",
      },
    },
  }

  describe("Content Validation", () => {
    it("should validate correct content structure", () => {
      expect(validateContent(validContent)).toBe(true)
    })

    it("should reject invalid content structure", () => {
      const invalidContent = { ...validContent }
      delete invalidContent.hero.title

      expect(validateContent(invalidContent)).toBe(false)

      const errors = getValidationErrors(invalidContent)
      expect(errors.length).toBeGreaterThan(0)
    })

    it("should validate color hex codes", () => {
      const invalidColorContent = {
        ...validContent,
        colorPalettes: [
          {
            name: "Invalid Palette",
            colors: ["invalid-color"],
            useCase: "Test",
            description: "Test",
          },
        ],
      }

      expect(validateContent(invalidColorContent)).toBe(false)
    })

    it("should validate project categories", () => {
      const invalidCategoryContent = {
        ...validContent,
        projects: [
          {
            ...validContent.projects[0],
            category: "invalid-category",
          },
        ],
      }

      expect(validateContent(invalidCategoryContent)).toBe(false)
    })
  })

  describe("Content Export", () => {
    it("should create content exporter", () => {
      const exporter = new ContentExporter(validContent)
      expect(exporter).toBeInstanceOf(ContentExporter)
    })

    it("should export content with default options", async () => {
      const exporter = new ContentExporter(validContent)
      const result = await exporter.exportContent()

      expect(result.success).toBe(true)
      expect(result.data).toBeInstanceOf(Blob)
      expect(result.filename).toMatch(/parsa-decor-content-\d{4}-\d{2}-\d{2}\.zip/)
    })

    it("should handle export errors gracefully", async () => {
      const invalidContent = {} as ContentData
      const exporter = new ContentExporter(invalidContent)
      const result = await exporter.exportContent()

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })
  })
})
