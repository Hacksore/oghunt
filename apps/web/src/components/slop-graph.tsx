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
        />
        <Line type="monotone" dataKey="aiProjectsPercentage" stroke="#ff495b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
