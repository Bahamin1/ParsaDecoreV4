"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Upload, Download, Eye } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-sm text-gray-500">Manage your website content and media</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            All changes saved
          </Badge>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Content
            </Button>

            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import Content
            </Button>

            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Preview Site
              </Button>
            </Link>

            <Button className="gap-2 bg-[#FF4500] hover:bg-[#E63E00]">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
