"use client";

import type { Metric } from "@prisma/client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SlopGraphProps {
  metrics: Metric[];
}

export function SlopGraph({ metrics }: SlopGraphProps) {
  const data = metrics.map((metric) => ({
    ...metric,
    timestamp: new Date(metric.timestamp),
    aiProjectsPercentage: metric.aiProjectsPercentage * 100, // Convert to percentage
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(date) => date.toLocaleDateString()}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, "AI Projects"]}
          labelFormatter={(date: Date) => date.toLocaleDateString()}
          contentStyle={{
            backgroundColor: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            color: "var(--color-text-primary)",
          }}
        />
        <Line
          type="monotone"
          dataKey="aiProjectsPercentage"
          stroke="var(--color-accent)"
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
