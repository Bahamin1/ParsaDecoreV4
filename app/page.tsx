import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { ColorPalettes } from "@/components/color-palettes"
import { Portfolio } from "@/components/portfolio"
import { Gallery } from "@/components/gallery"
import { AboutContact } from "@/components/about-contact"
import { Footer } from "@/components/footer"
import { getContentData } from "@/lib/content"

export default async function HomePage() {
  const contentData = await getContentData()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero data={contentData.hero} />
      <Services services={contentData.services} />
      <ColorPalettes palettes={contentData.colorPalettes} />
      <Portfolio projects={contentData.projects} />
      <Gallery items={contentData.gallery} />
      <AboutContact data={contentData.about} />
      <Footer />
    </main>
  )
}
