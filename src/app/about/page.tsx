import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    title: "About Morning, Trojan",
  },
};

export default function AboutPage() {
  return (
    <main className="about">
      <h1 className="about-title">What the f*ck is Morning, Trojan?</h1>
      <p>Congratulations. You&apos;ve stumbled upon possibly the greatest newsletter that ever existed.</p>
      <p>
        From 2022 to 2026, Morning, Trojan grew from a little-known email list
        to the dominant news source at USC. The newsletter, reported and founded
        by Tomo Chien (Class of 2026), was known for its snarky daily news
        aggregation and deeply sourced reporting about the university.
      </p>
      <p>
        Nearly 12,000 subscribers, from top executives to incoming freshmen,
        read the newsletter, which was the only USC student news outlet that
        didn&apos;t receive funding from the school.
      </p>
      <p>
        <a href="https://annahsu.dev" target="_blank" rel="noopener noreferrer">Anna Hsu</a> (Class of 2026) proofread the newsletter. You can find
        up-to-date contact information for Tomo Chien at{" "}
        <a href="https://tomo.news" target="_blank" rel="noopener noreferrer">this link</a>.
      </p>
      <style>{`
        .about {
          max-width: 560px;
          margin: 0 auto;
          padding-top: 2rem;
        }

        .about-title {
          font-size: 2.8rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 1.05;
          margin: 0 0 1.5rem;
        }

        .about p {
          font-size: 1rem;
          line-height: 1.65;
          color: #111;
          margin: 0 0 1.25rem;
        }

        .about a {
          color: #b81f1f;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </main>
  );
}
