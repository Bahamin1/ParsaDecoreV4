import { PortfolioEditor } from "@/components/admin/portfolio-editor"

export default function AdminPortfolioPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
        <p className="text-gray-600">Manage your portfolio projects and showcase work</p>
      </div>
      <PortfolioEditor />
    </div>
  )
}
