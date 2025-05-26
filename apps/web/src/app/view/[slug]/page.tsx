import { notFound } from "next/navigation";
import db from "../../db";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await db.post.findUnique({
    where: {
      id: params.slug,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg shadow-lg p-6 bg-neutral-100 dark:bg-neutral-950">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">{project.tagline}</p>
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
                  href={`https://www.producthunt.com/posts/${project.id}`}
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