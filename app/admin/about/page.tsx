import { AboutEditor } from "@/components/admin/about-editor"

export default function AdminAboutPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">About & Contact</h1>
        <p className="text-gray-600">Manage company information and contact details</p>
      </div>
      <AboutEditor />
    </div>
  )
}
