import type { Metadata } from "next";
import { getSortedPostsData } from "@/lib/posts";
import PageLoadMore from "@/components/pageLoadMore";
import GreatestHits from "@/components/greatestHits";
import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Archive | Morning, Trojan",
  openGraph: {
    title: "Morning, Trojan archive",
  },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function PostsPage() {
  const allPostsData = getSortedPostsData();
  const greatestHits = allPostsData.filter((p) => !p.hidden);

  return (
    <main className={dmSans.className}>
      <div className="archive-header">
        <h1 className="archive-title">Archive</h1>
      </div>
      <div className="gh-wrapper">
        <GreatestHits posts={greatestHits} />
      </div>
      <PageLoadMore allPostsData={allPostsData} />

      <style>{`
        .archive-header {
          max-width: 600px;
          margin: 0 auto;
          padding: 2.5rem 0 2rem;
        }

        .archive-title {
          margin: 0;
          font-size: 2.8rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .gh-wrapper {
          max-width: 600px;
          margin: 0 auto 1.75rem;
        }
      `}</style>
    </main>
  );
}
