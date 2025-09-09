"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ColorPalette {
  name: string
  colors: string[]
  useCase: string
  description: string
}

interface ColorPalettesProps {
  palettes: ColorPalette[]
}

export function ColorPalettes({ palettes }: ColorPalettesProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Color Palettes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Carefully curated color schemes that create the perfect mood and atmosphere for every space in your home or
            office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {palettes.map((palette, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex space-x-1 mb-4 h-20 rounded-lg overflow-hidden shadow-inner">
                  {palette.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="flex-1 transition-all duration-300 group-hover:scale-105"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">{palette.name}</CardTitle>
                <CardDescription className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {palette.useCase}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">{palette.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
