"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, Palette } from "lucide-react"
import { toast } from "sonner"

interface ColorPalette {
  name: string
  colors: string[]
  useCase: string
  description: string
}

export function ColorPalettesEditor() {
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPalettes()
  }, [])

  const loadPalettes = async () => {
    try {
      const response = await fetch("/api/admin/content")
      const data = await response.json()
      setPalettes(data.colorPalettes || [])
    } catch (error) {
      toast.error("Failed to load color palettes")
    } finally {
      setIsLoading(false)
    }
  }

  const savePalettes = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorPalettes: palettes }),
      })

      if (response.ok) {
        toast.success("Color palettes updated successfully!")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast.error("Failed to save color palettes")
    } finally {
      setIsSaving(false)
    }
  }

  const addPalette = () => {
    const newPalette: ColorPalette = {
      name: "",
      colors: ["#FFFFFF", "#000000"],
      useCase: "",
      description: "",
    }
    setPalettes([...palettes, newPalette])
  }

  const updatePalette = (index: number, field: keyof ColorPalette, value: string | string[]) => {
    setPalettes(palettes.map((palette, i) => (i === index ? { ...palette, [field]: value } : palette)))
  }

  const deletePalette = (index: number) => {
    setPalettes(palettes.filter((_, i) => i !== index))
  }

  const addColor = (paletteIndex: number) => {
    const updatedPalettes = [...palettes]
    updatedPalettes[paletteIndex].colors.push("#FFFFFF")
    setPalettes(updatedPalettes)
  }

  const updateColor = (paletteIndex: number, colorIndex: number, color: string) => {
    const updatedPalettes = [...palettes]
    updatedPalettes[paletteIndex].colors[colorIndex] = color
    setPalettes(updatedPalettes)
  }

  const removeColor = (paletteIndex: number, colorIndex: number) => {
    const updatedPalettes = [...palettes]
    updatedPalettes[paletteIndex].colors.splice(colorIndex, 1)
    setPalettes(updatedPalettes)
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading color palettes...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Color Palettes ({palettes.length})</h2>
        <div className="flex gap-2">
          <Button onClick={addPalette} className="bg-[#FF4500] hover:bg-[#E63E00]">
            <Plus className="h-4 w-4 mr-2" />
            Add Palette
          </Button>
          <Button onClick={savePalettes} disabled={isSaving} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {palettes.map((palette, paletteIndex) => (
          <Card key={paletteIndex}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#FF4500]" />
                  <CardTitle className="text-lg">Color Palette</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePalette(paletteIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Palette Name</label>
                  <Input
                    value={palette.name}
                    onChange={(e) => updatePalette(paletteIndex, "name", e.target.value)}
                    placeholder="e.g., Warm Neutrals"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Use Case</label>
                  <Input
                    value={palette.useCase}
                    onChange={(e) => updatePalette(paletteIndex, "useCase", e.target.value)}
                    placeholder="e.g., Living rooms, bedrooms"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={palette.description}
                  onChange={(e) => updatePalette(paletteIndex, "description", e.target.value)}
                  placeholder="Describe the mood and feel of this palette"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Colors</label>
                  <Button size="sm" variant="outline" onClick={() => addColor(paletteIndex)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Color
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {palette.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateColor(paletteIndex, colorIndex, e.target.value)}
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={color}
                        onChange={(e) => updateColor(paletteIndex, colorIndex, e.target.value)}
                        className="w-24 text-xs"
                        placeholder="#FFFFFF"
                      />
                      {palette.colors.length > 2 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeColor(paletteIndex, colorIndex)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {palettes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No color palettes added yet</p>
            <Button onClick={addPalette} className="bg-[#FF4500] hover:bg-[#E63E00]">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Palette
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
