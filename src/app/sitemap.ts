import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData().filter((p) => !p.hidden);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://morningtrojan.com/p/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "never",
    priority: 0.7,
  }));

  return [
    {
      url: "https://morningtrojan.com",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://morningtrojan.com/archive",
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...postEntries,
  ];
}
