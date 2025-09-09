"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Settings, Palette, FolderOpen, Camera, User, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Total Projects",
    value: "12",
    change: "+2 this month",
    icon: FolderOpen,
    color: "text-blue-600",
  },
  {
    title: "Gallery Images",
    value: "48",
    change: "+8 this week",
    icon: Camera,
    color: "text-green-600",
  },
  {
    title: "Color Palettes",
    value: "6",
    change: "Updated recently",
    icon: Palette,
    color: "text-purple-600",
  },
  {
    title: "Services",
    value: "4",
    change: "All active",
    icon: Settings,
    color: "text-orange-600",
  },
]

const quickActions = [
  {
    title: "Add New Project",
    description: "Create a new portfolio project",
    href: "/admin/portfolio/new",
    icon: FolderOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Upload Images",
    description: "Add images to gallery",
    href: "/admin/gallery",
    icon: Camera,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Update Hero",
    description: "Modify homepage hero section",
    href: "/admin/hero",
    icon: ImageIcon,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Edit About",
    description: "Update company information",
    href: "/admin/about",
    icon: User,
    color: "bg-orange-50 text-orange-600",
  },
]

const recentActivity = [
  {
    action: "Updated Modern Penthouse project",
    time: "2 hours ago",
    status: "completed",
  },
  {
    action: "Added 5 new gallery images",
    time: "1 day ago",
    status: "completed",
  },
  {
    action: "Modified hero background images",
    time: "3 days ago",
    status: "completed",
  },
  {
    action: "Created new color palette",
    time: "1 week ago",
    status: "completed",
  },
]

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Here's what's happening with your Parsa Decor website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to manage your website content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-[#FF4500] transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-[#FF4500] transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest changes to your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
