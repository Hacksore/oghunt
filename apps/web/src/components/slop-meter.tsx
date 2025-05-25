"use client";
import * as d3 from "d3";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../app/utils/string";

const useResizeObserver = (ref: React.RefObject<SVGSVGElement | null>) => {
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

    const barGroup = svg.append("g").attr("transform", "translate(0, 0)");

    // Bar A (Bar on the left side)
    barGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", containerWidth * ratioA)
      .attr("height", height)
      .classed("fill-accent dark:fill-accent", true);

    // Bar B (Bar on the right side)
    barGroup
      .append("rect")
      .attr("x", containerWidth * ratioA)
      .attr("y", 0)
      .attr("width", containerWidth * ratioB)
      .attr("height", height)
      .classed("dark:fill-[#171717] fill-neutral-200", true);
  }, [containerWidth, propA, propB, height]);

  return (
    <div>
      <div className="flex text-lg font-bold justify-between mb-1">
        <div className="pl-1">
          {nameA} • {formatNumber(propA)}
        </div>
        <div className="pr-1">
          {formatNumber(propB)} • {nameB}
        </div>
      </div>
      <svg className="w-full rounded-full" ref={svgRef} style={{ height: height }} />
    </div>
  );
};
