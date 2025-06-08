"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ProductPost } from "@/app/types";
import { Pill } from "@/components/pill";
import { VideoPlayer } from "@/components/video-player";
import { useState } from "react";

interface Media {
  url: string;
  videoUrl?: string;
}

interface ClientPageProps {
  project: ProductPost;
}

export default function ClientPage({ project }: ClientPageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const media = (project?.media as unknown as Media[]) || [];
  const videos = media.filter((m) => m.videoUrl);
  const images = media.filter((m) => !m.videoUrl);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {project.hasAi && (
          <div className="mb-6 rounded-lg bg-red-100 dark:bg-red-950 p-4 border-2 border-red-500">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-red-500"
                aria-label="Warning icon"
              >
                <title>Warning icon</title>
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              {project.hasAi && (
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">
                  This product is some form of AI slop and you should probably not use it
                </h2>
              )}
            </div>
          </div>
        )}
        <div className="rounded-lg shadow-lg p-6 bg-neutral-100 dark:bg-neutral-950">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">
                {project.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.topics.sort().map((topic) => (
                  <Pill key={topic.id} name={topic.name} />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <img
                src={project.thumbnailUrl}
                alt={project.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-neutral-600 dark:text-neutral-400">{project.description}</p>

            <div className="flex justify-end mt-6">
              <Button>
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

            {media.length > 0 && (
              <div className="mt-6 space-y-8">
                {/* Videos Section */}
                {videos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Demo</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {videos.map(
                        (media, index) =>
                          media.videoUrl && (
                            <VideoPlayer
                              key={`${project.id}-video-${index}`}
                              url={media.videoUrl}
                              poster={media.url}
                            />
                          ),
                      )}
                    </div>
                  </div>
                )}

                {/* Images Section */}
                {images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {images.map((media, index) => (
                        <button
                          type="button"
                          key={`${project.id}-image-${index}`}
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity w-full text-left"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setLightboxIndex(index);
                              setLightboxOpen(true);
                            }
                          }}
                        >
                          <img
                            src={media.url}
                            alt={`${project.name} screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lightbox */}
                <Lightbox
                  open={lightboxOpen}
                  close={() => setLightboxOpen(false)}
                  index={lightboxIndex}
                  slides={images.map((img) => ({ src: img.url }))}
                  carousel={{ finite: true }}
                  controller={{ closeOnBackdropClick: true }}
                  styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.75)" } }}
                />
              </div>
            )}

            <div className="flex gap-4 mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
