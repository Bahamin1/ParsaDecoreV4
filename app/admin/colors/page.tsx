import { ColorPalettesEditor } from "@/components/admin/color-palettes-editor"

export default function AdminColorsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Color Palettes</h1>
        <p className="text-gray-600">Manage your design color palettes and schemes</p>
      </div>
      <ColorPalettesEditor />
    </div>
  )
}
