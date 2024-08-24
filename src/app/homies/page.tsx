import { Card } from "../component/Card";
import { PROJECTS } from "../projects";

export default function Component() {
  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center bg-gradient-to-b p-1 text-center">
      <h1 className="text-primary text-4xl font-extrabold">The Homies Projects</h1>

      {PROJECTS.map((item, idx) => (
        <Card key={`card-${item.name}`} homie index={idx} post={item} />
      ))}
    </div>
  );
}
