"use client";

import { useState } from "react";
import Link from "next/link";
import { PostData } from "@/lib/posts";

interface GreatestHitsProps {
  posts: PostData[];
}

const ORDERED_SLUGS = [
  "usc-frat-sorority-rankings",
  "usc-spoof-security-fail",
  "usc-rate-my-professors-rankings",
  "guess-usc-tuition-win-weed",
  "beong-soo-kim-made-usc-president",
  "usc-bars-university-club",
  "usc-students-spring-break-cabo-mexico-travel",
  "usc-email-prank-april-fools-rick-caruso-levi-elias",
  "and-the-moron-of-the-year-is",
];

const PAGE_SIZE = 3;

export default function GreatestHits({ posts }: GreatestHitsProps) {
  const [page, setPage] = useState(0);

  const ordered = ORDERED_SLUGS
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean) as PostData[];

  const totalPages = Math.ceil(ordered.length / PAGE_SIZE);
  const visible = ordered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const startNum = page * PAGE_SIZE + 1;

  return (
    <div className="gh-container">
      <div className="gh-header">
        <span className="gh-label">Greatest hits</span>
        <div className="gh-nav">
          <button
            className="gh-arrow"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            aria-label="Previous"
          >
            ←
          </button>
          <button
            className="gh-arrow"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>

      <div className="gh-list">
        {visible.map(({ slug, title, web_exclusive }, i) => (
          <Link key={slug} href={`/p/${slug}`} className="gh-item">
            <span className="gh-num">{startNum + i}</span>
            <span className="gh-title">
              {title}
              {web_exclusive && <span className="gh-dot" />}
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .gh-container {
          background: #f7f6f3;
          border-radius: 10px;
          padding: 1rem 1.1rem;
        }

        .gh-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .gh-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.35);
        }

        .gh-nav {
          display: flex;
          gap: 0.25rem;
        }

        .gh-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: none;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 6px;
          color: rgba(0,0,0,0.4);
          cursor: pointer;
          font-size: 0.85rem;
          line-height: 1;
          transition: border-color 150ms ease, color 150ms ease;
          padding: 0;
        }

        .gh-arrow:hover:not(:disabled) {
          border-color: rgba(0,0,0,0.4);
          color: #000;
        }

        .gh-arrow:active:not(:disabled) {
          background: rgba(0,0,0,0.04);
        }

        .gh-arrow:disabled {
          opacity: 0.25;
          cursor: default;
        }

        .gh-list {
          display: flex;
          flex-direction: column;
        }

        .gh-item {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          text-decoration: none;
          color: inherit;
          transition: opacity 150ms ease;
        }

        .gh-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .gh-item:first-child {
          padding-top: 0;
        }

        .gh-item:hover {
          opacity: 0.6;
        }

        .gh-num {
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(0,0,0,0.25);
          min-width: 1rem;
          flex-shrink: 0;
        }

        .gh-title {
          font-size: 0.88rem;
          font-weight: 500;
          line-height: 1.3;
          color: #111;
        }

        .gh-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b81f1f;
          margin-left: 0.35rem;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
