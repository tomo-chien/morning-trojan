import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostData, getAllPostSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostSlugs();
}
const renderMarkdown = (markdown: string) => {
  const html = markdown
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>");

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getAllPostSlugs().map((s) => s.slug);
  if (!slugs.includes(slug)) notFound();
  const postData = await getPostData(slug);

  return (
    <main className="content">
      <div className="content-card">
        <article>{renderMarkdown(postData.content)}</article>
      </div>
      <style>{`
        p {
          margin: 0;
        }
          
        .content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-card {
          margin: -10px;
        }
      `}</style>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAllPostSlugs().map((s) => s.slug);
  if (!slugs.includes(slug)) notFound();
  const postData = await getPostData(slug);
  const description =
    postData.description.trim() || "Archived post from Morning, Trojan.";
  const canonicalPath = `/p/${postData.slug}`;
  const hasThumbnail = postData.thumbnail_url.trim().length > 0;
  const socialImage = hasThumbnail ? postData.thumbnail_url : "/MT.png";

  return {
    title: postData.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: postData.title,
      description,
      url: canonicalPath,
      siteName: "Morning, Trojan",
      type: "article",
      publishedTime: new Date(postData.date).toISOString(),
      images: [
        {
          url: socialImage,
          alt: postData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description,
      images: [socialImage],
    },
  };
}
