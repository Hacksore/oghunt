import type { ProductPost } from "./types";

let projectCounter = 1;

export function createProject(
  data: Omit<ProductPost, "id" | "topics" | "createdAt" | "votesCount" | "deleted" | "hasAi"> & {
    topics: string[];
  },
): ProductPost {
  const projectId = projectCounter.toString();
  projectCounter++;

  const { topics: topicNames, ...restData } = data;

  return {
    id: projectId,
    hasAi: false,
    deleted: false,
    votesCount: 0,
    createdAt: new Date(),
    topics: topicNames.map((topicName, index) => ({
      name: topicName,
      description: "",
      id: `${projectId}-${index + 1}`,
      postId: projectId,
    })),
    ...restData,
  };
}

export const PROJECTS: ProductPost[] = [
  createProject({
    name: "OGHUNT",
    url: "https://oghunt.com",
    tagline: "Product Hunt with ZERO AI Slop",
    description: "Product Hunt with ZERO AI Slop",
    thumbnailUrl: "https://oghunt.com/icon-128.png",
    topics: ["Product Hunt", "AI", "Next.js"],
  }),
  createProject({
    name: "Overlayed",
    url: "https://overlayed.dev",
    tagline: "Something about discord? idk",
    description:
      "See who's speaking in your Discord voice channel with a movable overlay, compatible with almost every game or app",
    thumbnailUrl:
      "https://raw.githubusercontent.com/overlayeddev/overlayed/main/apps/web/public/favicon_io/apple-touch-icon.png",
    topics: ["Discord", "Tauri", "React", "Rust"],
  }),
  createProject({
    name: "Flosa",
    url: "https://flosa.app",
    tagline: "Easily track job applications",
    description:
      "Flosa is a website designed to help users organize their job search process. It allows users to track applications, update statuses, visualize progress with a Sankey diagram, manage contacts and use a browser extension to save jobs from over 1,000 supported websites.",
    thumbnailUrl: "https://my.flosa.app/img/logo-ball.png",
    topics: ["Job Hunt", "Productivity", "React"],
  }),
  createProject({
    name: "Seattle Safe Eats",
    url: "https://seattlesafeeats.com",
    tagline: "See the health inspection results of Seattle restaurants",
    description:
      "Seattle Safe Eats is a tool that helps you find restaurants that have passed health inspections in Seattle.",
    thumbnailUrl: "https://www.seattlesafeeats.com/favicon.png",
    topics: ["Seattle", "Food", "Svelte"],
  }),
  createProject({
    name: "Splist.fm",
    url: "https://splist.fm/",
    tagline: "A clean and simple way to share your Spotify stats",
    description:
      "share your spotify playlists with friends and family so that they know you listen to good music",
    thumbnailUrl: "https://splist.fm/android-chrome-192x192.png",
    topics: ["Spotify", "Music", "React"],
  }),
  createProject({
    name: "Cook Around and Find Out",
    url: "https://cook-around-find-out-v2.vercel.app/",
    tagline: "Recipes made by an Australian chef",
    description:
      "Published recipes that I have piss-farted around with or found online and changed to my liking",
    thumbnailUrl: "https://cook-around-find-out-v2.vercel.app/logo-1000.jpg",
    topics: ["Astro", "Markdown", "Food"],
  }),
];
