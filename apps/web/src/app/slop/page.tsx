import { SlopGraph } from "@/components/slop-graph";
import type { Metadata } from "next";
import prisma from "../db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "OGHUNT | SlopMeter™ History",
  description: "View the history of SlopMeter™ metrics",
};

export default async function SlopPage() {
  // Get metrics from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const metrics = await prisma.metric.findMany({
    where: {
      timestamp: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <section className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">SlopMeter™ History</h1>
        <div className="w-full h-[500px]">
          <SlopGraph metrics={metrics} />
        </div>
      </section>
    </main>
  );
}
