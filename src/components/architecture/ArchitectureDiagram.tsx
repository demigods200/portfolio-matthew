"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ARCH_NODES, ARCH_EDGES } from "@/lib/content/architecture";
import type { ArchNode } from "@/lib/content/architecture";

const W = 820;
const H = 420;
const NODE_W = 110;
const NODE_H = 44;

function getNodeCenter(node: ArchNode) {
  return { x: node.x + NODE_W / 2, y: node.y + NODE_H / 2 };
}

function buildPath(from: ArchNode, to: ArchNode): string {
  const f = getNodeCenter(from);
  const t = getNodeCenter(to);
  const dx = t.x - f.x;
  const cp1x = f.x + dx * 0.4;
  const cp2x = t.x - dx * 0.4;
  return `M ${f.x} ${f.y} C ${cp1x} ${f.y}, ${cp2x} ${t.y}, ${t.x} ${t.y}`;
}

interface TooltipState {
  node: ArchNode;
  // CSS pixel position relative to the outer wrapper div
  x: number;
  y: number;
}

export function ArchitectureDiagram() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeMap = new Map(ARCH_NODES.map((n) => [n.id, n]));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  function showTooltip(node: ArchNode) {
    const svg = svgRef.current;
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const svgRect = svg.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Scale factor from SVG viewBox coords to rendered CSS pixels
    const scaleX = svgRect.width / W;
    const scaleY = svgRect.height / H;

    // Node center in CSS pixels, relative to the outer wrapper
    const cssX = (node.x + NODE_W / 2) * scaleX + (svgRect.left - wrapperRect.left);
    const cssY = node.y * scaleY + (svgRect.top - wrapperRect.top);

    setTooltip({ node, x: cssX, y: cssY });
  }

  return (
    // Outer div is the tooltip anchor — no overflow restrictions
    <div ref={wrapperRef} className="relative">
      {/* Inner div handles horizontal scroll only */}
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="min-w-[640px]"
          style={{ maxHeight: H }}
        >
          {/* Edges */}
          {ARCH_EDGES.map((edge, i) => {
            const fromNode = nodeMap.get(edge.from);
            const toNode = nodeMap.get(edge.to);
            if (!fromNode || !toNode) return null;
            const d = buildPath(fromNode, toNode);

            return (
              <g key={edge.id}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke="var(--border-default)"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={visible ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{
                    pathLength: { duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.2, delay: 0.3 + i * 0.1 },
                  }}
                />
                {edge.label && (() => {
                  const f = getNodeCenter(fromNode);
                  const t = getNodeCenter(toNode);
                  const mx = (f.x + t.x) / 2;
                  const my = (f.y + t.y) / 2;
                  return (
                    <motion.text
                      x={mx}
                      y={my - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill="var(--text-tertiary)"
                      fontFamily="var(--font-geist-mono)"
                      initial={{ opacity: 0 }}
                      animate={visible ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                    >
                      {edge.label}
                    </motion.text>
                  );
                })()}
              </g>
            );
          })}

          {/* Nodes */}
          {ARCH_NODES.map((node, i) => (
            <motion.g
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: `${node.x + NODE_W / 2}px ${node.y + NODE_H / 2}px` }}
              onMouseEnter={() => showTooltip(node)}
              onMouseLeave={() => setTooltip(null)}
              className="cursor-pointer"
            >
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill="var(--bg-surface-2)"
                stroke={tooltip?.node.id === node.id ? "var(--border-default)" : "var(--border-subtle)"}
                strokeWidth={1}
              />
              <text
                x={node.x + NODE_W / 2}
                y={node.y + 16}
                textAnchor="middle"
                fontSize="11"
                fontWeight="500"
                fill="var(--text-primary)"
                fontFamily="var(--font-geist-sans)"
              >
                {node.label}
              </text>
              <text
                x={node.x + NODE_W / 2}
                y={node.y + 30}
                textAnchor="middle"
                fontSize="9"
                fill="var(--text-tertiary)"
                fontFamily="var(--font-geist-mono)"
              >
                {node.sublabel}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Tooltip — absolute inside outer wrapper, never clipped by overflow-x-auto */}
      {tooltip && (
        <div
          className="absolute z-20 w-56 rounded-lg border border-[var(--border-default)] bg-[var(--bg-overlay)] p-3 shadow-xl pointer-events-none text-xs text-[var(--text-secondary)] leading-relaxed"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, calc(-100% - 8px))",
          }}
        >
          <span className="block text-[var(--text-primary)] font-medium mb-1">
            {tooltip.node.label}
          </span>
          {tooltip.node.tooltip}
        </div>
      )}
    </div>
  );
}
