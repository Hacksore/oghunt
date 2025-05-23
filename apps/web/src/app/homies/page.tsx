import { Card } from "../component/card";
import { Link } from "../component/link";
import { MobileCard } from "../component/mobile-card";
import { generateOGHuntMetadata } from "../metadata";
import { PROJECTS } from "../projects";

export const generateMetadata = generateOGHuntMetadata({
  title: "OGHUNT | The Homies Projects",
  description: "Our homies cooked many diffrent side projects please give them a look 🙏",
});

export default function Component() {
  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center bg-gradient-to-b p-1 text-center">
      <Link href="/" className="mt-4 font-bold text-2xl">
        ← Back to Product Hunt with ZERO AI Slop
      </Link>
      <h1 className="text-white my-8 text-6xl font-extrabold">The Homies Projects</h1>

      <div className="flex flex-col gap-4 overflow-hidden px-2 text-left md:gap-8">
        {PROJECTS.map((item, idx) => (
          <>
            {idx !== 0 && (
              <div className="flex h-0.5 w-full bg-neutral-200 md:hidden dark:bg-neutral-800" />
            )}
            <div key={`desktop-${item.name}`} className="hidden md:flex">
              <Card key={`card-${item.name}`} homie index={idx} post={item} />
            </div>
            <div key={`mobile-${item.name}`} className="md:hidden">
              <MobileCard key={`card-${item.name}`} post={item} />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
