import type { Metadata } from "next";
import Nav from "@/components/nav";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://morningtrojan.com"),
  title: "Morning, Trojan",
  description: "The greatest USC newsletter that ever existed.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Morning, Trojan",
    description: "The greatest USC newsletter that ever existed.",
    url: "/",
    siteName: "Morning, Trojan",
    type: "website",
    images: [
      {
        url: "/banner.jpg",
        alt: "Morning, Trojan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morning, Trojan",
    description: "The greatest USC newsletter that ever existed.",
    images: ["/banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="body">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
