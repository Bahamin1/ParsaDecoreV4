"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  ImageIcon,
  Palette,
  FolderOpen,
  Camera,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Hero Section", href: "/admin/hero", icon: ImageIcon },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "Color Palettes", href: "/admin/colors", icon: Palette },
  { name: "Portfolio", href: "/admin/portfolio", icon: FolderOpen },
  { name: "Gallery", href: "/admin/gallery", icon: Camera },
  { name: "About & Contact", href: "/admin/about", icon: User },
  { name: "Export & Sync", href: "/admin/export", icon: Download },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("bg-white border-r border-gray-200 transition-all duration-300", collapsed ? "w-16" : "w-64")}>
      <div className="flex flex-col h-screen">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/images/parsa-logo-circular.png"
                alt="Parsa Decor"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <h2 className="font-bold text-[#FF4500]">Parsa Decor</h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-[#FF4500]"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-[#FF4500] text-white" : "text-gray-700 hover:bg-gray-100 hover:text-[#FF4500]",
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-[#FF4500] transition-colors"
          >
            <Home className="h-4 w-4" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}
