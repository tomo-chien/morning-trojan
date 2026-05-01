import Link from "next/link";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function HomePage() {
  return (
    <main className={`home ${dmSans.className}`}>
      <div className="inner">
        <h1 className="title" aria-label="Morning, Trojan">
          <div className="line-wrap"><span className="title-top">Morning,</span></div>
          <div className="line-wrap"><span className="title-bottom">Trojan.</span></div>
        </h1>

        <p className="tagline">The greatest USC newsletter that ever existed.</p>

        <nav className="actions">
          <Link href="/archive" className="cta-primary">
            Take me to the archive
          </Link>
          <Link href="/about" className="cta-secondary">
            What the f*ck is Morning, Trojan?
          </Link>
        </nav>
      </div>

      <style>{`
        .home {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .inner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .title {
          margin: 0;
          font-size: clamp(3.5rem, 11vw, 7rem);
          line-height: 0.88;
          letter-spacing: -0.07em;
          font-weight: 700;
        }

        .line-wrap {
          overflow: hidden;
          padding-bottom: 0.4em;
          margin-bottom: -0.4em;
        }

        .title-top,
        .title-bottom {
          display: block;
        }

        .title-top {
          color: #000;
          animation: slideUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .title-bottom {
          color: #b81f1f;
          animation: slideUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both 100ms;
        }

        .tagline {
          margin: 0;
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: rgba(0, 0, 0, 0.55);
          letter-spacing: -0.02em;
          animation: slideUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both 220ms;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          animation: slideUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both 340ms;
        }

        .cta-primary,
        .cta-secondary {
          text-decoration: none;
          font-size: 1rem;
          font-weight: 700;
          width: fit-content;
          transition: opacity 160ms ease;
        }

        .cta-primary {
          color: #000;
          border-bottom: 2px solid #000;
          padding-bottom: 1px;
        }

        .cta-secondary {
          color: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          padding-bottom: 1px;
          font-weight: 500;
        }

        .cta-primary:hover,
        .cta-secondary:hover {
          opacity: 0.6;
        }

        @media (max-width: 640px) {
          .title {
            font-size: 4.2rem;
          }
        }

        @keyframes slideUp {
          from { transform: translateY(60%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }

      `}</style>
    </main>
  );
}
