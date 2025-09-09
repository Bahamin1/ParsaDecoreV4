import { getProject, getContentData } from "@/lib/content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectDetail } from "@/components/project-detail"
import type { Metadata } from "next"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.id)

  return {
    title: `${project.title} - Parsa Decor`,
    description: project.description,
  }
}

export async function generateStaticParams() {
  const data = await getContentData()

  return data.projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id)

  return (
    <main className="min-h-screen">
      <Header />
      <ProjectDetail project={project} />
      <Footer />
    </main>
  )
}
