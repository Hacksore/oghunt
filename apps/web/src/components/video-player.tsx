import { cn } from "@/app/utils/tw";
import { useEffect, useState } from "react";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ url, poster, className }: VideoPlayerProps) {
  const [videoType, setVideoType] = useState<"youtube" | "vimeo" | "direct" | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    // YouTube URL patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    // Vimeo URL patterns
    const vimeoPatterns = [/vimeo\.com\/([0-9]+)/, /player\.vimeo\.com\/video\/([0-9]+)/];

    // Check for YouTube
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        setVideoType("youtube");
        setVideoId(match[1]);
        return;
      }
    }

    // Check for Vimeo
    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern);
      if (match) {
        setVideoType("vimeo");
        setVideoId(match[1]);
        return;
      }
    }

    // If no patterns match, assume it's a direct video URL
    setVideoType("direct");
    setVideoId(url);
  }, [url]);

  if (!videoType || !videoId) {
    return null;
  }

  return (
    <div className={cn("relative aspect-video rounded-lg overflow-hidden", className)}>
      {videoType === "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {videoType === "vimeo" && (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {videoType === "direct" && (
        <video
          src={videoId}
          controls
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <track kind="captions" src="" label="English" />
        </video>
      )}
    </div>
  );
}
