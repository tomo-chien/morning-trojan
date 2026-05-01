import type { Metadata } from "next";
import Image from "next/image";
import { DM_Sans } from "next/font/google";
import tomo from "@/app/tomo.jpeg";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Tomo Chien",
  openGraph: {
    title: "Tomo Chien — Morning, Trojan",
  },
};

export default function TomoChienPage() {
  return (
    <main className={`author-page ${dmSans.className}`}>
      <div className="author-top">
        <Image
          src={tomo}
          alt="Tomo Chien"
          height={72}
          width={72}
          className="author-avatar"
        />
        <div>
          <h1 className="author-name">Tomo Chien</h1>
          <p className="author-role">Editor | Morning, Trojan</p>
        </div>
      </div>

      <p className="author-bio">
        I founded and ran Morning, Trojan from 2022 to 2026. Visit{" "}
        <a href="https://tomo.news" target="_blank" rel="noopener noreferrer">
          this link
        </a>{" "}
        for my most up-to-date contact information.
      </p>

      <div className="author-links">
        <a
          href="https://www.linkedin.com/in/tomo-chien-57b429200/"
          target="_blank"
          rel="noopener noreferrer"
          className="author-link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
        <a
          href="https://x.com/tomoki_chien"
          target="_blank"
          rel="noopener noreferrer"
          className="author-link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="X">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      <style>{`
        .author-page {
          max-width: 520px;
          margin: 0 auto;
          padding-top: 3rem;
          padding-bottom: 4rem;
        }

        .author-top {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .author-avatar {
          border-radius: 50%;
          flex-shrink: 0;
        }

        .author-name {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin: 0 0 0.2rem;
          line-height: 1;
        }

        .author-role {
          font-size: 0.78rem;
          color: rgba(0,0,0,0.38);
          margin: 0;
        }

        .author-bio {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #222;
          margin: 0 0 1.5rem;
        }

        .author-bio a {
          color: #b81f1f;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .author-links {
          display: flex;
          gap: 0.5rem;
        }

        .author-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(0,0,0,0.45);
          text-decoration: none;
          background: #f5f5f3;
          border-radius: 8px;
          padding: 0.45rem 0.55rem;
          transition: background 150ms ease, color 150ms ease;
        }

        .author-link:hover {
          background: #ebebea;
          color: #000;
        }
      `}</style>
    </main>
  );
}
