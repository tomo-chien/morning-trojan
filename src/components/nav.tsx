"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const links = [
  { href: "/about", label: "About" },
  { href: "/praise", label: "Praise" },
  { href: "/archive", label: "Archive" },
];

export default function Nav() {
  const pathname = usePathname();
  const showNav = pathname !== "/";
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!showNav) return null;

  return (
    <header className={`header ${dmSans.className}`}>
      <Link className="logo" href="/">
        Morning, <span className="trojan">Trojan</span>
      </Link>

      {/* Desktop nav */}
      <nav className="nav-desktop">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            className={`navlink${
              pathname === href || (href === "/archive" && pathname.includes("/p/"))
                ? " active"
                : ""
            }`}
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Hamburger button (mobile only) */}
      <button
        className={`hamburger${open ? " is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="drawer" onClick={() => setOpen(false)}>
          <nav className="drawer-nav" onClick={(e) => e.stopPropagation()}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                className={`drawer-link${
                  pathname === href || (href === "/archive" && pathname.includes("/p/"))
                    ? " active"
                    : ""
                }`}
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 100;
        }

        .logo {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #000;
          text-decoration: none;
        }

        .trojan {
          color: #b81f1f;
        }

        /* Desktop nav */
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .navlink {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.35);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .navlink:hover { color: #000; }
        .navlink.active { color: #000; }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .hamburger span {
          display: block;
          width: 100%;
          height: 1.5px;
          background: #000;
          border-radius: 2px;
          transition: transform 220ms ease, opacity 150ms ease;
          transform-origin: center;
        }

        .hamburger.is-open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.is-open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Mobile drawer */
        .drawer {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: rgba(0,0,0,0.15);
          backdrop-filter: blur(2px);
          animation: fadeIn 180ms ease;
        }

        .drawer-nav {
          position: absolute;
          top: 0;
          right: 0;
          width: 60vw;
          max-width: 260px;
          height: 100%;
          background: #fff;
          display: flex;
          flex-direction: column;
          padding: 5rem 2rem 2rem;
          gap: 0.25rem;
          box-shadow: -8px 0 32px rgba(0,0,0,0.08);
          animation: slideIn 220ms cubic-bezier(0.25, 1, 0.5, 1);
        }

        .drawer-link {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: rgba(0,0,0,0.25);
          text-decoration: none;
          transition: color 150ms ease;
          padding: 0.3rem 0;
        }

        .drawer-link:hover { color: #000; }
        .drawer-link.active { color: #000; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }

        @media (max-width: 600px) {
          .nav-desktop { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </header>
  );
}
