"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Document, EnrichedDocumentSearchResults } from "flexsearch";
import { PostData } from "@/lib/posts";

type IndexablePostData = {
  slug: string;
  title: string;
  content: string;
};

type SearchIndexEntry = {
  slug: string;
  title: string;
  date: number;
  hidden: boolean;
  web_exclusive: boolean;
  content: string;
};

interface PageLoadMoreProps {
  allPostsData: PostData[];
}

export default function PageLoadMore({ allPostsData }: PageLoadMoreProps) {
  const limit = 30;
  const [visible, setVisible] = useState(limit);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Document<IndexablePostData>>();
  const [results, setResults] = useState<PostData[]>(
    allPostsData.filter((post) => !post.hidden)
  );
  const [webExclusives, setWebExclusives] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [yearOpen, setYearOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) {
        setYearOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = useMemo(() => {
    const ys = Array.from(
      new Set(
        allPostsData
          .filter((p) => !p.hidden)
          .map((p) => new Date(p.date).getFullYear())
      )
    ).sort((a, b) => b - a);
    return ys;
  }, [allPostsData]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/search-index.json");
      const data: SearchIndexEntry[] = await res.json();

      const idx = new Document<IndexablePostData>({
        document: {
          id: "slug",
          index: ["title", "content"],
          store: ["slug", "title", "content"],
        },
        tokenize: "full",
      });

      data
        .filter((post) => !post.hidden)
        .forEach((post) =>
          idx.add({ slug: post.slug, title: post.title, content: post.content })
        );

      setIndex(idx);
    }

    load();
  }, []);

  useEffect(() => {
    if (!index) return;

    const base = allPostsData
      .filter((p) => !p.hidden)
      .filter((p) => !webExclusives || p.web_exclusive)
      .filter((p) => !selectedYear || new Date(p.date).getFullYear() === selectedYear)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (query.trim() === "") {
      setResults(base);
      setVisible(limit);
      return;
    }

    const matches = index.search(query.toLowerCase(), {
      enrich: true,
    }) as EnrichedDocumentSearchResults<IndexablePostData>;

    const slugs = matches.flatMap((m) => m.result.map((r) => r.id));
    setResults(base.filter((p) => slugs.includes(p.slug)));
    setVisible(limit);
  }, [query, index, webExclusives, selectedYear, allPostsData]);

  const showMore = () => setVisible((prev) => prev + limit);
  const remaining = results.length - visible;

  return (
    <div className="posts-container">
      <div className="search-row">
        <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="search"
          type="text"
          placeholder={`Search ${allPostsData.filter((p) => !p.hidden).length} issues...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search"
        />
      </div>

      <div className="filters">
        <div className="year-dropdown" ref={yearRef}>
          <button
            className={`chip year-btn${selectedYear ? " active" : ""}`}
            onClick={() => setYearOpen((o) => !o)}
          >
            {selectedYear ? selectedYear : "Filter by year"}
            <svg className={`chevron${yearOpen ? " open" : ""}`} width="9" height="9" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {yearOpen && (
            <div className="year-menu">
              <button
                className={`year-option${!selectedYear ? " selected" : ""}`}
                onClick={() => { setSelectedYear(null); setYearOpen(false); }}
              >
                All years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  className={`year-option${selectedYear === y ? " selected" : ""}`}
                  onClick={() => { setSelectedYear(y); setYearOpen(false); }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className={`chip${webExclusives ? " active" : ""}`}
          onClick={() => setWebExclusives(!webExclusives)}
        >
          Web exclusives
          <span className="red-dot" />
        </button>
      </div>

      <div className="posts">
        {results.slice(0, visible).map(({ slug, title, date, web_exclusive }) => (
          <Link href={`/p/${slug}`} key={slug} className="row">
            <span className="row-date">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              <span className="row-year">{new Date(date).getFullYear()}</span>
            </span>
            <span className="row-title">
              {web_exclusive ? (
                <>
                  {title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span style={{ whiteSpace: "nowrap" }}>
                    {title.split(" ").slice(-1)[0]}
                    <span className="red-dot" title="Web exclusive" />
                  </span>
                </>
              ) : title}
            </span>
          </Link>
        ))}
        {results.length === 0 && (
          <p className="no-results">
            {query.trim() ? `No results for "${query}"` : "No issues match these filters."}
          </p>
        )}
      </div>

      {visible < results.length && (
        <button onClick={showMore} className="load-more">
          {remaining > limit ? `Show ${limit} more` : `Show ${remaining} more`}
        </button>
      )}

      <style>{`
        .posts-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 4rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(0,0,0,0.18);
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          transition: border-color 150ms ease;
        }

        .search-row:focus-within {
          border-color: rgba(0,0,0,0.5);
        }

        .search-icon {
          color: rgba(0,0,0,0.3);
          flex-shrink: 0;
        }

        .search {
          flex: 1;
          font-family: inherit;
          font-size: 0.85rem;
          background: none;
          border: none;
          outline: none;
          color: #000;
        }

        .search::placeholder {
          color: rgba(0, 0, 0, 0.28);
        }

        .filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .year-dropdown {
          position: relative;
        }

        .year-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .chevron {
          transition: transform 200ms ease;
          flex-shrink: 0;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .year-menu {
          position: absolute;
          top: calc(100% + 0.4rem);
          left: 0;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 0.3rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          z-index: 10;
          min-width: 7rem;
          animation: menuIn 150ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .year-option {
          font-family: inherit;
          font-size: 0.78rem;
          font-weight: 400;
          background: none;
          border: none;
          border-radius: 8px;
          padding: 0.35rem 0.65rem;
          text-align: left;
          cursor: pointer;
          color: rgba(0,0,0,0.6);
          transition: background 120ms ease, color 120ms ease;
        }

        .year-option:hover {
          background: rgba(0,0,0,0.05);
          color: #000;
        }

        .year-option.selected {
          font-weight: 600;
          color: #000;
        }

        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chip {
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 500;
          background: none;
          border: 1px solid rgba(0, 0, 0, 0.18);
          border-radius: 999px;
          padding: 0.25rem 0.7rem;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.45);
          white-space: nowrap;
          transition: all 150ms ease;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .chip.active {
          background: #000;
          border-color: #000;
          color: #fff;
        }

        .chip:not(.active):hover {
          border-color: rgba(0, 0, 0, 0.4);
          color: #000;
        }

        .posts {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: grid;
          grid-template-columns: 5.5rem 1fr;
          gap: 1rem;
          align-items: baseline;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          text-decoration: none;
          color: inherit;
        }

        .row:first-child {
          border-top: 1px solid rgba(0, 0, 0, 0.07);
        }

        .row:hover .row-title {
          color: #b81f1f;
        }

        .row-date {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.35);
          font-weight: 400;
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          flex-shrink: 0;
        }

        .row-year {
          font-size: 0.65rem;
          color: rgba(0, 0, 0, 0.22);
        }

        .row-title {
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.35;
          color: #111;
          transition: color 150ms ease;
        }

        .red-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b81f1f;
          margin-left: 0.4rem;
          vertical-align: middle;
          flex-shrink: 0;
        }

        .no-results {
          font-size: 0.875rem;
          color: rgba(0, 0, 0, 0.4);
          padding: 1.5rem 0;
          margin: 0;
        }

        .load-more {
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 500;
          background: none;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 8px;
          padding: 0.55rem 1.25rem;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.55);
          transition: all 150ms ease;
          align-self: center;
        }

        .load-more:hover {
          border-color: rgba(0,0,0,0.5);
          color: #000;
        }

        @media (max-width: 640px) {
          .row {
            grid-template-columns: 3.8rem 1fr;
            gap: 0.6rem;
          }

          .row-date {
            font-size: 0.65rem;
          }

          .row-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
