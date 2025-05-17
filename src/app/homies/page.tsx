import { Card } from "../component/Card";
import { MobileCard } from "../component/MobileCard";
import { generateOGHuntMetadata } from "../metadata";
import { PROJECTS } from "../projects";

export const generateMetadata = generateOGHuntMetadata({
  title: "OGHUNT | The Homies Projects",
  description: "Our homies cooked many diffrent side projects please give them a look 🙏",
});

export default function Component() {
  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center bg-gradient-to-b p-1 text-center">
      <a
        href="/"
        className="my-8 border-b border-[var(--background-start-rgb)] bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-2xl text-transparent duration-150 hover:border-black dark:border-black dark:from-pink-300 dark:to-orange-300 dark:hover:border-white"
      >
        Back to Product Hunt with ZERO AI Slop™
      </a>
      <h1 className="text-primary pb-8 text-6xl font-extrabold">The Homies Projects</h1>

      <div className="flex flex-col gap-4 overflow-hidden px-2 text-left md:gap-8">
        {PROJECTS.map((item, idx) => (
          <>
            {idx !== 0 && (
              <div className="flex h-0.5 w-full bg-neutral-200 md:hidden dark:bg-neutral-800" />
            )}
            <div className="hidden md:flex">
              <Card key={`card-${item.name}`} homie index={idx} post={item} />
            </div>
            <div className="md:hidden">
              <MobileCard key={`card-${item.name}`} post={item} />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
