"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { patternLabComponents, type PatternComponent } from "../command-center-data";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface MapNode {
  id: string;
  component: PatternComponent;
  x: number;
  y: number;
  radius: number;
  ring: number; // 0=atom, 1=molecule, 2=organism, 3=template
  categoryAngle: number;
}

interface MapEdge {
  from: string;
  to: string;
}

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS — Eddie palette for canvas drawing
// ─────────────────────────────────────────────────────────────
const C = {
  page:       "#f6f1e8",
  surface:    "#f0ebe3",
  cream:      "#f7f3ec",
  gold:       "#b8956a",
  goldLight:  "#c9a87e",
  goldPale:   "rgba(184,149,106,0.12)",
  espresso:   "#2c1810",
  ink:        "#1a1a1a",
  inkSoft:    "#2c2c2c",
  inkMuted:   "#7a7a7a",
  muted:      "#6f6a63",
  borderSoft: "rgba(44,24,16,0.08)",
  // Ring colors per atomic level
  atom:       "#b8956a",  // gold
  molecule:   "#6b4ea0",  // purple
  organism:   "#2d7a50",  // green
  template:   "#3066a0",  // blue
  atomBg:     "rgba(184,149,106,0.08)",
  moleculeBg: "rgba(107,78,160,0.08)",
  organismBg: "rgba(45,122,80,0.08)",
  templateBg: "rgba(48,102,160,0.08)",
};

const LEVEL_META: Record<string, { ring: number; color: string; bg: string; label: string }> = {
  atom:     { ring: 0, color: C.atom,     bg: C.atomBg,     label: "Atoms" },
  molecule: { ring: 1, color: C.molecule, bg: C.moleculeBg, label: "Molecules" },
  organism: { ring: 2, color: C.organism, bg: C.organismBg, label: "Organisms" },
  template: { ring: 3, color: C.template, bg: C.templateBg, label: "Templates" },
};

// ─────────────────────────────────────────────────────────────
// COMPOSITION EDGES — how atoms → molecules → organisms → templates
// ─────────────────────────────────────────────────────────────
const EDGES: MapEdge[] = [
  // Atoms → Molecules (atoms that compose into molecules)
  { from: "Headings", to: "Heading Group" },
  { from: "Headings", to: "Block Hero" },
  { from: "Headings", to: "Block Headline Byline" },
  { from: "Headings", to: "Block Headline Only" },
  { from: "Paragraph", to: "Intro Text" },
  { from: "Paragraph", to: "Caption" },
  { from: "Paragraph", to: "Address" },
  { from: "Blockquote", to: "Blockquote Citation" },
  { from: "Blockquote", to: "Pullquote" },
  { from: "Time", to: "Byline (Author+Time)" },
  { from: "Avatar", to: "Byline (Author)" },
  { from: "Avatar", to: "Byline (Author+Time)" },
  { from: "Landscape 16:9", to: "Image with Caption" },
  { from: "Landscape 16:9", to: "Block Hero" },
  { from: "Landscape 4:3", to: "Block Thumb Headline" },
  { from: "Social Icons", to: "Social Share" },
  { from: "Text Fields", to: "Search" },
  { from: "Text Fields", to: "Newsletter Form" },
  { from: "Text Fields", to: "Comment Form" },
  { from: "Checkboxes", to: "Comment Form" },
  { from: "Buttons", to: "Search" },
  { from: "Buttons", to: "Newsletter Form" },
  { from: "Buttons", to: "Comment Form" },
  { from: "Buttons", to: "Primary Nav" },
  { from: "Buttons", to: "Pagination" },
  { from: "Buttons", to: "Tabs" },
  { from: "Unordered List", to: "Primary Nav" },
  { from: "Unordered List", to: "Footer Nav" },
  { from: "Inline Elements", to: "Emphasis Colors" },
  { from: "Logo", to: "Primary Nav" },
  // Molecules → Organisms
  { from: "Primary Nav", to: "Header" },
  { from: "Footer Nav", to: "Footer" },
  { from: "Social Share", to: "Footer" },
  { from: "Search", to: "Header" },
  { from: "Heading Group", to: "Article Body" },
  { from: "Intro Text", to: "Article Body" },
  { from: "Image with Caption", to: "Article Body" },
  { from: "Blockquote Citation", to: "Article Body" },
  { from: "Single Comment", to: "Comment Thread" },
  { from: "Block Hero", to: "Carousel List" },
  { from: "Block Thumb Headline", to: "Related Posts" },
  { from: "Block Thumb Headline", to: "Latest Posts" },
  { from: "Block Headline Byline", to: "Latest Posts" },
  { from: "Byline (Author+Time)", to: "Article Body" },
  // Organisms → Templates
  { from: "Header", to: "Homepage" },
  { from: "Header", to: "Blog" },
  { from: "Header", to: "Article" },
  { from: "Footer", to: "Homepage" },
  { from: "Footer", to: "Blog" },
  { from: "Footer", to: "Article" },
  { from: "Carousel List", to: "Homepage" },
  { from: "Latest Posts", to: "Homepage" },
  { from: "Latest Posts", to: "Blog" },
  { from: "Related Posts", to: "Blog" },
  { from: "Related Posts", to: "Article" },
  { from: "Article Body", to: "Article" },
  { from: "Comment Thread", to: "Article" },
  { from: "Recent Tweets", to: "Homepage" },
];

// ─────────────────────────────────────────────────────────────
// LAYOUT — place nodes in concentric rings by atomic level
// ─────────────────────────────────────────────────────────────
const RING_RADII = [220, 480, 700, 880]; // px from center
const NODE_SIZES = [10, 12, 15, 20]; // base radius per level
const CENTER_X = 0;
const CENTER_Y = 0;

function layoutNodes(): MapNode[] {
  const nodes: MapNode[] = [];
  const levels: PatternComponent["level"][] = ["atom", "molecule", "organism", "template"];

  for (const level of levels) {
    const meta = LEVEL_META[level];
    const comps = patternLabComponents.filter((c) => c.level === level);
    const categories = [...new Set(comps.map((c) => c.category))];
    const ringR = RING_RADII[meta.ring];
    const baseSize = NODE_SIZES[meta.ring];

    // Distribute categories evenly around the ring
    let globalIdx = 0;
    const totalComps = comps.length;

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const cat = categories[catIdx];
      const catComps = comps.filter((c) => c.category === cat);

      for (let i = 0; i < catComps.length; i++) {
        const angle = ((globalIdx / totalComps) * Math.PI * 2) - Math.PI / 2;
        // Add slight radial jitter for organic feel
        const jitter = (Math.sin(globalIdx * 7.3) * 0.08 + Math.cos(globalIdx * 3.1) * 0.05) * ringR;
        const r = ringR + jitter;

        nodes.push({
          id: catComps[i].name,
          component: catComps[i],
          x: CENTER_X + Math.cos(angle) * r,
          y: CENTER_Y + Math.sin(angle) * r,
          radius: baseSize + (catComps.length > 3 ? 2 : 0),
          ring: meta.ring,
          categoryAngle: angle,
        });
        globalIdx++;
      }
    }
  }

  return nodes;
}

// ─────────────────────────────────────────────────────────────
// CANVAS RENDERER
// ─────────────────────────────────────────────────────────────

function drawMap(
  ctx: CanvasRenderingContext2D,
  nodes: MapNode[],
  edges: MapEdge[],
  width: number,
  height: number,
  camera: { x: number; y: number; zoom: number },
  hoveredNode: MapNode | null,
  selectedNode: MapNode | null,
  dpr: number,
) {
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = C.page;
  ctx.fillRect(0, 0, width, height);

  // Grain texture dots (subtle)
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 800; i++) {
    const gx = (Math.sin(i * 127.1) * 0.5 + 0.5) * width;
    const gy = (Math.cos(i * 311.7) * 0.5 + 0.5) * height;
    ctx.fillStyle = C.espresso;
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Apply camera transform
  const cx = width / 2 + camera.x * camera.zoom;
  const cy = height / 2 + camera.y * camera.zoom;
  ctx.translate(cx, cy);
  ctx.scale(camera.zoom, camera.zoom);

  // Draw ring zones
  for (const [, meta] of Object.entries(LEVEL_META)) {
    const r = RING_RADII[meta.ring];
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, r, 0, Math.PI * 2);
    ctx.strokeStyle = meta.bg;
    ctx.lineWidth = 60 / camera.zoom;
    ctx.stroke();

    // Ring label
    ctx.save();
    ctx.fillStyle = meta.color;
    ctx.globalAlpha = 0.3;
    ctx.font = `600 ${14 / camera.zoom}px "Clash Display", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(meta.label.toUpperCase(), CENTER_X, -r - 30 / camera.zoom);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // Build node lookup
  const nodeMap = new Map<string, MapNode>();
  for (const n of nodes) nodeMap.set(n.id, n);

  // Determine highlighted connections
  const activeId = selectedNode?.id ?? hoveredNode?.id ?? null;
  const connectedIds = new Set<string>();
  const activeEdges = new Set<number>();
  if (activeId) {
    connectedIds.add(activeId);
    edges.forEach((e, i) => {
      if (e.from === activeId || e.to === activeId) {
        connectedIds.add(e.from);
        connectedIds.add(e.to);
        activeEdges.add(i);
      }
    });
  }

  // Draw edges
  edges.forEach((e, i) => {
    const from = nodeMap.get(e.from);
    const to = nodeMap.get(e.to);
    if (!from || !to) return;

    const isActive = activeEdges.has(i);
    ctx.beginPath();
    // Curved lines for organic feel
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const curveOffset = dist * 0.15;
    const perpX = -(to.y - from.y) / dist * curveOffset;
    const perpY = (to.x - from.x) / dist * curveOffset;

    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo(midX + perpX, midY + perpY, to.x, to.y);

    if (isActive) {
      ctx.strokeStyle = LEVEL_META[to.component.level].color;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2 / camera.zoom;
    } else {
      ctx.strokeStyle = C.borderSoft;
      ctx.globalAlpha = activeId ? 0.05 : 0.15;
      ctx.lineWidth = 1 / camera.zoom;
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Draw nodes
  for (const node of nodes) {
    const meta = LEVEL_META[node.component.level];
    const isHovered = hoveredNode?.id === node.id;
    const isSelected = selectedNode?.id === node.id;
    const isConnected = connectedIds.has(node.id);
    const dimmed = activeId && !isConnected;

    const r = node.radius;
    const scale = isHovered ? 1.3 : isSelected ? 1.2 : 1;
    const drawR = r * scale;

    ctx.globalAlpha = dimmed ? 0.15 : 1;

    // Node glow
    if (isHovered || isSelected) {
      const grad = ctx.createRadialGradient(node.x, node.y, drawR, node.x, node.y, drawR * 3);
      grad.addColorStop(0, meta.color + "30");
      grad.addColorStop(1, meta.color + "00");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, drawR * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Node circle — glass style
    ctx.beginPath();
    ctx.arc(node.x, node.y, drawR, 0, Math.PI * 2);
    const fillGrad = ctx.createRadialGradient(
      node.x - drawR * 0.3,
      node.y - drawR * 0.3,
      0,
      node.x,
      node.y,
      drawR,
    );
    fillGrad.addColorStop(0, "rgba(255,255,255,0.9)");
    fillGrad.addColorStop(1, meta.bg.replace("0.08", "0.25"));
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.strokeStyle = isSelected ? meta.color : isHovered ? meta.color : meta.color + "60";
    ctx.lineWidth = (isSelected || isHovered ? 2.5 : 1.2) / camera.zoom;
    ctx.stroke();

    // Node label — show when zoomed in enough or hovered
    if (camera.zoom > 0.6 || isHovered || isSelected || isConnected) {
      ctx.fillStyle = dimmed ? C.muted : isSelected || isHovered ? meta.color : C.inkSoft;
      const fontSize = Math.max(9, Math.min(12, 11 / camera.zoom));
      ctx.font = `${isSelected || isHovered ? 600 : 500} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(node.id, node.x, node.y + drawR + 5 / camera.zoom);
    }

    ctx.globalAlpha = 1;
  }

  // Center marker
  ctx.beginPath();
  ctx.arc(CENTER_X, CENTER_Y, 4 / camera.zoom, 0, Math.PI * 2);
  ctx.fillStyle = C.gold + "40";
  ctx.fill();

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────
// HIT TESTING
// ─────────────────────────────────────────────────────────────
function hitTest(
  mx: number,
  my: number,
  nodes: MapNode[],
  width: number,
  height: number,
  camera: { x: number; y: number; zoom: number },
): MapNode | null {
  // Convert screen coords to world coords
  const cx = width / 2 + camera.x * camera.zoom;
  const cy = height / 2 + camera.y * camera.zoom;
  const wx = (mx - cx) / camera.zoom;
  const wy = (my - cy) / camera.zoom;

  let closest: MapNode | null = null;
  let closestDist = Infinity;

  for (const node of nodes) {
    const dist = Math.hypot(node.x - wx, node.y - wy);
    const hitRadius = node.radius * 1.8; // generous hit area
    if (dist < hitRadius && dist < closestDist) {
      closest = node;
      closestDist = dist;
    }
  }

  return closest;
}

// ─────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────
function DetailPanel({
  node,
  edges,
  onClose,
}: {
  node: MapNode;
  edges: MapEdge[];
  onClose: () => void;
}) {
  const meta = LEVEL_META[node.component.level];
  const usedBy = edges.filter((e) => e.from === node.id).map((e) => e.to);
  const uses = edges.filter((e) => e.to === node.id).map((e) => e.from);

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 320,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.6)",
        borderTop: "1px solid rgba(255,255,255,0.8)",
        borderRadius: 20,
        boxShadow:
          "0 1px 2px rgba(44,24,16,0.04), 0 12px 40px rgba(44,24,16,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        padding: "24px",
        zIndex: 10,
        fontFamily: `"Plus Jakarta Sans", system-ui, sans-serif`,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: "rgba(44,24,16,0.06)",
          border: "none",
          borderRadius: 8,
          width: 28,
          height: 28,
          cursor: "pointer",
          fontSize: 14,
          color: C.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>

      {/* Level badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: 999,
          background: meta.bg,
          border: `1px solid ${meta.color}30`,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: meta.color,
          fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: meta.color,
          }}
        />
        {meta.label.slice(0, -1).toUpperCase()}
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: `"Clash Display", system-ui, sans-serif`,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: C.ink,
          margin: "0 0 4px",
          lineHeight: 1.15,
        }}
      >
        {node.component.name}
      </h3>

      {/* Category */}
      <div
        style={{
          fontSize: 13,
          color: C.muted,
          marginBottom: 18,
        }}
      >
        {node.component.category}
      </div>

      {/* Path */}
      <div
        style={{
          background: "rgba(44,24,16,0.04)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 12,
          fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
          color: C.inkMuted,
          marginBottom: 18,
          wordBreak: "break-all",
        }}
      >
        {node.component.path}
      </div>

      {/* Connections */}
      {uses.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.inkMuted,
              marginBottom: 8,
              fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
            }}
          >
            Composed from
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {uses.map((name) => {
              const comp = patternLabComponents.find((c) => c.name === name);
              const col = comp ? LEVEL_META[comp.level].color : C.muted;
              return (
                <span
                  key={name}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${col}10`,
                    border: `1px solid ${col}25`,
                    color: col,
                    fontWeight: 500,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {usedBy.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.inkMuted,
              marginBottom: 8,
              fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
            }}
          >
            Composes into
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {usedBy.map((name) => {
              const comp = patternLabComponents.find((c) => c.name === name);
              const col = comp ? LEVEL_META[comp.level].color : C.muted;
              return (
                <span
                  key={name}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${col}10`,
                    border: `1px solid ${col}25`,
                    color: col,
                    fontWeight: 500,
                  }}
                >
                  {name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export function SystemMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 0.55 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, camX: 0, camY: 0 });
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);

  const nodesRef = useRef<MapNode[]>(layoutNodes());
  const animRef = useRef<number>(0);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const render = () => {
      drawMap(
        ctx,
        nodesRef.current,
        EDGES,
        size.width,
        size.height,
        camera,
        hoveredNode,
        selectedNode,
        dpr,
      );
      animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animRef.current);
  }, [size, camera, hoveredNode, selectedNode]);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, camX: camera.x, camY: camera.y });
    },
    [camera],
  );

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (isDragging) {
        const dx = (e.clientX - dragStart.x) / camera.zoom;
        const dy = (e.clientY - dragStart.y) / camera.zoom;
        setCamera((c) => ({ ...c, x: dragStart.camX + dx, y: dragStart.camY + dy }));
      } else {
        const hit = hitTest(mx, my, nodesRef.current, size.width, size.height, camera);
        setHoveredNode(hit);
      }
    },
    [isDragging, dragStart, camera, size],
  );

  const handleMouseUp = useCallback(
    (e: ReactMouseEvent) => {
      if (isDragging) {
        const moved =
          Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y);
        if (moved < 5) {
          // It was a click
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const hit = hitTest(mx, my, nodesRef.current, size.width, size.height, camera);
            setSelectedNode(hit);
          }
        }
      }
      setIsDragging(false);
    },
    [isDragging, dragStart, camera, size],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;
      setCamera((c) => ({
        ...c,
        zoom: Math.max(0.2, Math.min(3, c.zoom * zoomFactor)),
      }));
    },
    [],
  );

  // Wheel listener (needs passive: false)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const resetCamera = () => setCamera({ x: 0, y: 0, zoom: 0.55 });

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "calc(100vh - 52px)",
        overflow: "hidden",
        background: C.page,
        cursor: isDragging ? "grabbing" : hoveredNode ? "pointer" : "grab",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredNode(null);
        }}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* HUD — top left */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          fontFamily: `"Plus Jakarta Sans", system-ui, sans-serif`,
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: 16,
            boxShadow:
              "0 1px 2px rgba(44,24,16,0.04), 0 8px 24px rgba(44,24,16,0.06)",
            padding: "18px 22px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.inkMuted,
              fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
              marginBottom: 6,
            }}
          >
            ⚡ Ctrl+Alt+Design
          </div>
          <h2
            style={{
              fontFamily: `"Clash Display", system-ui, sans-serif`,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: C.ink,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            System Map
          </h2>
          <p
            style={{
              fontSize: 13,
              color: C.muted,
              margin: "6px 0 14px",
              lineHeight: 1.5,
            }}
          >
            {patternLabComponents.length} components across 4 atomic levels
          </p>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(LEVEL_META).map(([key, meta]) => {
              const count = patternLabComponents.filter(
                (c) => c.level === key,
              ).length;
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: C.inkSoft,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: meta.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>{meta.label}</span>
                  <span style={{ color: C.muted }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 6,
          }}
        >
          <button
            onClick={resetCamera}
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: C.inkSoft,
              cursor: "pointer",
              fontFamily: `"Plus Jakarta Sans", system-ui, sans-serif`,
            }}
          >
            ⊕ Recenter
          </button>
          <button
            onClick={() =>
              setCamera((c) => ({ ...c, zoom: Math.min(3, c.zoom * 1.3) }))
            }
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 600,
              color: C.inkSoft,
              cursor: "pointer",
            }}
          >
            +
          </button>
          <button
            onClick={() =>
              setCamera((c) => ({ ...c, zoom: Math.max(0.2, c.zoom * 0.7) }))
            }
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 14,
              fontWeight: 600,
              color: C.inkSoft,
              cursor: "pointer",
            }}
          >
            −
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 999,
          padding: "8px 20px",
          fontSize: 12,
          color: C.muted,
          fontFamily: `"Plus Jakarta Sans", system-ui, sans-serif`,
          fontWeight: 500,
          zIndex: 10,
        }}
      >
        Scroll to zoom · Drag to pan · Click a node to inspect
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <DetailPanel
          node={selectedNode}
          edges={EDGES}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
