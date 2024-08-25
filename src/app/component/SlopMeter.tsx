"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatNumber } from "../utils/string";

const useResizeObserver = (ref: React.RefObject<SVGSVGElement>) => {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) {
        return;
      }
      const newWidth = entries[0].contentRect.width;
      setWidth(newWidth);
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, [ref]);

  return width;
};

interface RatioBarProps {
  propA: number;
  propB: number;
  nameA: string;
  nameB: string;
  height: number;
}

export const SlopMeter: React.FC<RatioBarProps> = ({ propA, propB, nameA, nameB, height = 20 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerWidth = useResizeObserver(svgRef);

  useEffect(() => {
    if (containerWidth === null) return;

    const total = propA + propB;
    const ratioA = propA / total;
    const ratioB = propB / total;

    const svg = d3.select(svgRef.current);

    svg.attr("width", containerWidth).attr("height", height);

    // Clear previous content
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "gradientA")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "20%").attr("stop-color", "#fda4af"); // Start color

    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#fb923c"); // End color

    const barGroup = svg.append("g").attr("transform", "translate(0, 0)");

    // Bar A (Bar on the left side)
    barGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", containerWidth * ratioA)
      .attr("height", height)
      .attr("fill", "url(#gradientA)");

    // Bar B (Bar on the right side)
    barGroup
      .append("rect")
      .attr("x", containerWidth * ratioA)
      .attr("y", 0)
      .attr("width", containerWidth * ratioB)
      .attr("height", height)
      .classed("dark:fill-[#171717] fill-neutral-200", true);

    // Text A (Label on the left side)
    svg
      .append("text")
      .attr("x", 8)
      .attr("y", height / 2 + 5)
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .style("font-weight", "bold")
      .style(
        "text-shadow",
        "1px 1px 0px #fda4af, -1px -1px 0px #fda4af, 1px -1px 0px #fda4af, -1px 1px 0px #fda4af",
      )
      .text(nameA + " • " + formatNumber(propA));

    // Text B (Label on the right side)
    svg
      .append("text")
      .attr("x", containerWidth - 8)
      .attr("y", height / 2 + 5)
      .attr("text-anchor", "end")
      .style(
        "text-shadow",
        "1px 1px 0px black, -1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black",
      )
      .classed("font-bold dark:fill-neutral-200 fill-black", true)
      .text(formatNumber(propB) + " • " + nameB);
  }, [containerWidth, propA, propB, nameA, nameB, height]);

  return (
    <div className="overflow-hidden rounded-lg">
      <svg ref={svgRef} style={{ width: "100%" }} />
    </div>
  );
};
