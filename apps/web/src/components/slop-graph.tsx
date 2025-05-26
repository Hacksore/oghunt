"use client";

import type { Metric } from "@prisma/client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface SlopGraphProps {
  metrics: Metric[];
}

export function SlopGraph({ metrics }: SlopGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || metrics.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const x = d3
      .scaleTime()
      .domain(d3.extent(metrics, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    // Create the line generator
    const line = d3
      .line<Metric>()
      .x((d) => x(new Date(d.timestamp)))
      .y((d) => y(d.aiProjectsPercentage));

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Add the y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${(Number(d) * 100).toFixed(0)}%`),
      );

    // Add the line path
    svg
      .append("path")
      .datum(metrics)
      .attr("fill", "none")
      .attr("stroke", "#ff495b")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    svg
      .selectAll("circle")
      .data(metrics)
      .join("circle")
      .attr("cx", (d) => x(new Date(d.timestamp)))
      .attr("cy", (d) => y(d.aiProjectsPercentage))
      .attr("r", 4)
      .attr("fill", "#ff495b");
  }, [metrics]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
