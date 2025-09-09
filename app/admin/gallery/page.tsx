import { GalleryEditor } from "@/components/admin/gallery-editor"

export default function AdminGalleryPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-600">Upload and organize your design showcase images</p>
      </div>
      <GalleryEditor />
    </div>
  )
}
