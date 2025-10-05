import { notFound } from "next/navigation";
import { generateOGHuntMetadata } from "@/app/metadata";
import db from "../../db";
import ClientPage from "./page.client";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.slug.split("-")[0];

  const project = await db.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!project) {
    return generateOGHuntMetadata({
      title: "oghunt | Project Not Found",
      description: "The requested project could not be found.",
      skipOgImage: true,
    })();
  }

  return generateOGHuntMetadata({
    title: `oghunt | ${project.name}`,
    description: project.tagline,
    skipOgImage: true,
  })();
};

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.slug.split("-")[0];

  const project = await db.post.findUnique({
    where: {
      id: id,
    },
    include: {
      topics: {
        include: {
          Topic: true,
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  const projectWithTopics = {
    ...project,
    topics: project.topics.map((topic) => topic.Topic),
  };

  return <ClientPage project={projectWithTopics} />;
}
