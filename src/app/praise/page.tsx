"use client";

import { useState, useEffect, useMemo } from "react";
import { DM_Sans } from "next/font/google";
import rawTestimonials from "@/content/testimonials.json";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Testimonial = {
  Name: string;
  Title: string;
  Testimonial: string;
  Highlight: string;
  "News clip": string;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Spread clips evenly among others so no two clips are ever adjacent
function spreadClips(clips: Testimonial[], others: Testimonial[]): Testimonial[] {
  if (clips.length === 0) return others;
  if (others.length === 0) return clips;

  const result: Testimonial[] = [];
  const gap = others.length / (clips.length + 1);
  let oi = 0;

  for (let ci = 0; ci < clips.length; ci++) {
    const target = Math.round(gap * (ci + 1));
    while (oi < target && oi < others.length) result.push(others[oi++]);
    result.push(clips[ci]);
  }
  while (oi < others.length) result.push(others[oi++]);
  return result;
}

// Final safety pass: if any two news clips are vertically adjacent, swap the
// second one with the nearest non-clip item after it
function fixAdjacentClips(col: Testimonial[]): Testimonial[] {
  const isNC = (t: Testimonial) => !!t["News clip"];
  const result = [...col];
  for (let i = 0; i < result.length - 1; i++) {
    if (isNC(result[i]) && isNC(result[i + 1])) {
      const swapIdx = result.findIndex((t, j) => j > i + 1 && !isNC(t));
      if (swapIdx !== -1) {
        [result[i + 1], result[swapIdx]] = [result[swapIdx], result[i + 1]];
      }
    }
  }
  return result;
}

// Rough height estimate based on text length so we can balance column heights
function estimateHeight(t: Testimonial): number {
  const charsPerLine = 32;
  const lineHeight = 22;
  const base = 72; // padding + name + title
  return base + Math.ceil(t.Testimonial.length / charsPerLine) * lineHeight;
}

function shortestCol(heights: number[]): number {
  return heights.indexOf(Math.min(...heights));
}

function buildColumns(items: Testimonial[], numCols: number): Testimonial[][] {
  const isHighlighted = (t: Testimonial) => t.Highlight === "x";
  const isNewsClip = (t: Testimonial) => !!t["News clip"];

  const highlightedClips = shuffle(items.filter((t) => isHighlighted(t) && isNewsClip(t)));
  const highlightedOnly = shuffle(items.filter((t) => isHighlighted(t) && !isNewsClip(t)));
  const newsClips = shuffle(items.filter((t) => isNewsClip(t) && !isHighlighted(t)));
  const regular = shuffle(items.filter((t) => !isHighlighted(t) && !isNewsClip(t)));

  const cols: Testimonial[][] = Array.from({ length: numCols }, () => []);
  const heights = Array(numCols).fill(0);

  function addToCol(col: number, item: Testimonial) {
    cols[col].push(item);
    heights[col] += estimateHeight(item);
  }

  // Pin one highlighted news clip to column 0 top
  const pinnedClip = highlightedClips[0];
  if (pinnedClip) addToCol(0, pinnedClip);

  // Distribute remaining highlighted round-robin (they all go near the top)
  const restHighlighted = shuffle([...highlightedClips.slice(1), ...highlightedOnly]);
  restHighlighted.forEach((item, i) => addToCol(i % numCols, item));

  // Build the remaining pool: clips spread among regulars so no two clips
  // are adjacent, then assign each item to the shortest column
  const remaining = spreadClips(newsClips, regular);
  remaining.forEach((item) => addToCol(shortestCol(heights), item));

  return cols.map(fixAdjacentClips);
}

function useNumCols(): number {
  const [numCols, setNumCols] = useState(3);

  useEffect(() => {
    function update() {
      if (window.innerWidth <= 480) setNumCols(1);
      else if (window.innerWidth <= 700) setNumCols(2);
      else setNumCols(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return numCols;
}

export default function TestimonialsPage() {
  const numCols = useNumCols();
  const [columns, setColumns] = useState<Testimonial[][]>([]);

  // Shuffle once on mount; recompute column assignment when numCols changes
  const [shuffledItems] = useState<Testimonial[]>(() => rawTestimonials as Testimonial[]);

  useEffect(() => {
    setColumns(buildColumns(shuffledItems, numCols));
  }, [numCols, shuffledItems]);

  function renderBubble(t: Testimonial, i: number) {
    const url = t["News clip"];
    const isNewsClip = !!url;
    const inner = (
      <>
        <p className="bubble-text">&ldquo;{t.Testimonial}&rdquo;</p>
        <div className="bubble-meta">
          <span className={`bubble-name${isNewsClip ? " bubble-name-clip" : ""}`}>
            {t.Name}{isNewsClip && <span className="bubble-arrow">→</span>}
          </span>
          {t.Title && <span className="bubble-title">{t.Title}</span>}
        </div>
      </>
    );

    return isNewsClip ? (
      <a
        key={i}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="bubble bubble-linked"
      >
        {inner}
      </a>
    ) : (
      <div key={i} className="bubble">
        {inner}
      </div>
    );
  }

  return (
    <main className={`testimonials-page ${dmSans.className}`}>
      <div className="t-header">
        <h1 className="t-title">Praise for Morning, Trojan</h1>
      </div>

      <div className="bubble-grid">
        {columns.map((col, ci) => (
          <div key={ci} className="bubble-col">
            {col.map((t, i) => renderBubble(t, i))}
          </div>
        ))}
      </div>

      <style>{`
        .testimonials-page {
          padding-bottom: 4rem;
        }

        .t-header {
          padding: 2.5rem 0 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .t-title {
          margin: 0;
          font-size: 2.8rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .t-sub {
          margin: 0.4rem 0 0;
          font-size: 0.8rem;
          color: rgba(0,0,0,0.35);
        }

        .bubble-grid {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .bubble-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bubble {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.09);
          border-radius: 14px;
          padding: 1rem 1.1rem;
          box-sizing: border-box;
          width: 100%;
        }

        .bubble-linked {
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          background: #f5f0eb;
        }

        .bubble-text {
          margin: 0 0 0.65rem;
          font-size: 0.875rem;
          line-height: 1.45;
          color: #111;
          overflow-wrap: break-word;
        }

        .bubble-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .bubble-name {
          font-size: 0.75rem;
          font-weight: 700;
          color: #111;
        }

        .bubble-name-clip {
          color: #7a0000;
        }

        .bubble-arrow {
          margin-left: 0.25rem;
          font-style: normal;
          opacity: 0.7;
        }

        .bubble-title {
          font-size: 0.7rem;
          color: rgba(0,0,0,0.4);
        }
      `}</style>
    </main>
  );
}
