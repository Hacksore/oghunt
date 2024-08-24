import { Card } from "../component/Card";
import { PROJECTS } from "../projects";

export default function Component() {
  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center bg-gradient-to-b p-1 text-center">
      <a href="/" className="py-8 text-2xl text-blue-400">
        Back to Product Hunt with ZERO AI Slop™
      </a>
      <h1 className="text-primary pb-8 text-6xl font-extrabold">The Homies Projects</h1>

      {PROJECTS.map((item, idx) => (
        <Card key={`card-${item.name}`} homie index={idx} post={item} />
      ))}
    </div>
  );
}
