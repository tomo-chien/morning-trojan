import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Praise",
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
