import { ServicesEditor } from "@/components/admin/services-editor"

export default function AdminServicesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <p className="text-gray-600">Manage your service offerings and descriptions</p>
      </div>
      <ServicesEditor />
    </div>
  )
}
