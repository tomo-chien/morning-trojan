import Link from "next/link";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function NotFound() {
  return (
    <main className={dmSans.className}>
      <div className="container">
        <p className="code">404</p>
        <h1 className="heading">Page not found</h1>
        <Link href="/" className="link">Take me to the homepage →</Link>
      </div>

      <style>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 4rem 0;
        }

        .code {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(0,0,0,0.3);
          margin: 0 0 0.75rem;
        }

        .heading {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin: 0 0 0.5rem;
        }

        .link {
          font-size: 0.9rem;
          font-weight: 500;
          color: #b81f1f;
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
