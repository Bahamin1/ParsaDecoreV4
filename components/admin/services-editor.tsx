"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Building, Home, Lightbulb, Plus, Save, Trash2, Wrench } from "lucide-react"
import { useEffect, useState } from "react"

const iconMap = {
  home: Home,
  building: Building,
  lightbulb: Lightbulb,
  wrench: Wrench,
}

interface Service {
  id: string
  title: string
  description: string
  icon: keyof typeof iconMap
}

export function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setServices(data.services || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveServices = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/content")
      const currentContent = await response.json()

      const updatedContent = {
        ...currentContent,
        services: services,
      }

      const saveResponse = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedContent),
      })

      if (saveResponse.ok) {
        toast({
          title: "Success",
          description: "Services updated successfully!",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save services",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: "",
      description: "",
      icon: "home",
    }
    setServices([...services, newService])
  }

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const deleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading services...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Services ({services.length})</h2>
        <div className="flex gap-2">
          <Button onClick={addService} className="bg-[#FF4500] hover:bg-[#E63E00]">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
          <Button onClick={saveServices} disabled={isSaving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon]
          return (
            <Card key={service.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-[#FF4500]" />
                    <CardTitle className="text-lg">Service Details</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteService(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(service.id, "title", e.target.value)}
                    placeholder="Service title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={service.description}
                    onChange={(e) => updateService(service.id, "description", e.target.value)}
                    placeholder="Service description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Icon</label>
                  <div className="flex gap-2">
                    {Object.keys(iconMap).map((iconKey) => {
                      const Icon = iconMap[iconKey as keyof typeof iconMap]
                      return (
                        <Button
                          key={iconKey}
                          variant={service.icon === iconKey ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateService(service.id, "icon", iconKey as keyof typeof iconMap)}
                          className={service.icon === iconKey ? "bg-[#FF4500] hover:bg-[#E63E00]" : ""}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {services.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No services added yet</p>
            <Button onClick={addService} className="bg-[#FF4500] hover:bg-[#E63E00]">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
