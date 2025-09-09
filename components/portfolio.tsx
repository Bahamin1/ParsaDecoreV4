"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  category: string
  description: string
  images: string[]
  materials: string[]
  specs: {
    area: string
    duration: string
    year: string
  }
}

interface PortfolioProps {
  projects: Project[]
}

export function Portfolio({ projects }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const categories = ["all", "residential", "commercial", "small-rooms"]
  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((project) => project.category === selectedCategory)

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our collection of thoughtfully designed spaces that showcase our commitment to excellence and
            attention to detail.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`capitalize px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category ? "bg-gray-900 text-white shadow-lg" : "hover:bg-gray-100"
                }`}
              >
                {category === "all" ? "All Projects" : category.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="capitalize">
                    {project.category.replace("-", " ")}
                  </Badge>
                  <span className="text-sm text-gray-500">{project.specs.year}</span>
                </div>
                <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative h-80 lg:h-96">
                  <Image
                    src={selectedProject.images[0] || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {selectedProject.category.replace("-", " ")}
                    </Badge>
                    <span className="text-gray-500">{selectedProject.specs.year}</span>
                  </div>

                  <h3 className="font-playfair text-3xl font-bold text-gray-900 mb-4">{selectedProject.title}</h3>

                  <p className="text-gray-600 leading-relaxed mb-6">{selectedProject.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Project Specs</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>Area: {selectedProject.specs.area}</li>
                        <li>Duration: {selectedProject.specs.duration}</li>
                        <li>Completed: {selectedProject.specs.year}</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Materials Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedProject.images.length > 1 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedProject.images.slice(1).map((image, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${selectedProject.title} ${index + 2}`}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
