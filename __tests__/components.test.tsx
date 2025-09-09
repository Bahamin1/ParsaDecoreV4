import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe("Frontend Components", () => {
  const mockHeroData = {
    title: "Parsa Decor",
    tagline: "Interior Design and Decor",
    description: "Test description",
    videoUrl: "https://youtube.com/test",
    backgroundImages: ["/test1.jpg", "/test2.jpg"],
  }

  const mockProjects = [
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
  ]

  describe("Hero Component", () => {
    it("renders hero content correctly", () => {
      render(<Hero data={mockHeroData} />)

      expect(screen.getByText("Parsa Decor")).toBeInTheDocument()
      expect(screen.getByText("Interior Design and Decor")).toBeInTheDocument()
      expect(screen.getByText("Test description")).toBeInTheDocument()
    })

    it("shows video modal when play button is clicked", async () => {
      const user = userEvent.setup()
      render(<Hero data={mockHeroData} />)

      const playButton = screen.getByRole("button", { name: /play/i })
      await user.click(playButton)

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument()
      })
    })
  })

  describe("Portfolio Component", () => {
    it("renders projects correctly", () => {
      render(<Portfolio projects={mockProjects} />)

      expect(screen.getByText("Test Project")).toBeInTheDocument()
      expect(screen.getByText("Test Description")).toBeInTheDocument()
    })

    it("filters projects by category", async () => {
      const user = userEvent.setup()
      const multipleProjects = [
        ...mockProjects,
        {
          ...mockProjects[0],
          id: "commercial-project",
          title: "Commercial Project",
          category: "commercial",
        },
      ]

      render(<Portfolio projects={multipleProjects} />)

      // Click commercial filter
      const commercialFilter = screen.getByText("Commercial")
      await user.click(commercialFilter)

      expect(screen.getByText("Commercial Project")).toBeInTheDocument()
      expect(screen.queryByText("Test Project")).not.toBeInTheDocument()
    })
  })
})

describe("Admin Components", () => {
  describe("Admin Dashboard", () => {
    it("renders dashboard statistics", () => {
      render(<AdminDashboard />)

      expect(screen.getByText("Welcome back!")).toBeInTheDocument()
      expect(screen.getByText("Total Projects")).toBeInTheDocument()
      expect(screen.getByText("Gallery Images")).toBeInTheDocument()
      expect(screen.getByText("Quick Actions")).toBeInTheDocument()
    })

    it("renders quick action links", () => {
      render(<AdminDashboard />)

      expect(screen.getByText("Add New Project")).toBeInTheDocument()
      expect(screen.getByText("Upload Images")).toBeInTheDocument()
      expect(screen.getByText("Update Hero")).toBeInTheDocument()
      expect(screen.getByText("Edit About")).toBeInTheDocument()
    })
  })
})
