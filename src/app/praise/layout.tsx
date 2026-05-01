import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Praise | Morning, Trojan",
  openGraph: {
    title: "Praise for Morning, Trojan",
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
