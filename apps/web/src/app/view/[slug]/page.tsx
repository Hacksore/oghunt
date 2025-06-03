import { generateOGHuntMetadata } from "@/app/metadata";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import db from "../../db";

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
  // Extract the ID from the slug (format: "id-product-name")
  const id = resolvedParams.slug.split("-")[0];

  const project = await db.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!project) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-lg p-6 bg-neutral-100 dark:bg-neutral-950">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">
                {project.tagline}
              </p>
            </div>
            <img
              src={project.thumbnailUrl}
              alt={project.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">{project.description}</p>

            <div className="flex gap-4 mt-8">
              <Button asChild>
                <a
                  href={`https://www.producthunt.com/posts/${project.id}?utm_source=oghunt&utm_medium=referral&utm_campaign=view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Product Hunt
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
