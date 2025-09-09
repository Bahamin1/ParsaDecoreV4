"use client"

import { useState } from "react"
import { Home, Building, Lightbulb, Wrench } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Service {
  id: string
  title: string
  description: string
  icon: string
}

interface ServicesProps {
  services: Service[]
}

const iconMap = {
  home: Home,
  building: Building,
  lightbulb: Lightbulb,
  wrench: Wrench,
}

export function Services({ services }: ServicesProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From concept to completion, we offer comprehensive interior design services tailored to your unique vision
            and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]

            return (
              <Card
                key={service.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  hoveredCard === service.id ? "scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
