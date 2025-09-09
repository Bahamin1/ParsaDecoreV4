"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, ChevronDown } from "lucide-react"
import { VideoModal } from "./video-modal"

interface HeroProps {
  data: {
    title: string
    tagline: string
    description: string
    videoUrl: string
    backgroundImages: string[]
  }
}

export function Hero({ data }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % data.backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [data.backgroundImages.length])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax */}
      <div className="absolute inset-0">
        {data.backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Interior design ${index + 1}`}
              fill
              className="object-cover parallax-bg"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 fade-in-up">
          <Image
            src="/images/parsa-logo.png"
            alt="Parsa Decor Logo"
            width={200}
            height={200}
            className="mx-auto w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 float-animation"
          />
        </div>

        {/* Neon Title */}
        <h1 className="font-playfair text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 neon-text fade-in-up">
          {data.title}
        </h1>

        <p className="text-xl sm:text-2xl lg:text-3xl mb-6 text-gray-200 fade-in-up">{data.tagline}</p>

        <p className="text-lg sm:text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed fade-in-up">
          {data.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 fade-in-up">
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href="#portfolio">View Portfolio</a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 bg-transparent"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Video
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoUrl={data.videoUrl} />
    </section>
  )
}
