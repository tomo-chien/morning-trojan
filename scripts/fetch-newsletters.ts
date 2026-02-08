import fs from "fs";
import path from "path";
import { PostData } from "@/lib/posts"
import "dotenv/config";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPostDetail(id: string) {
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/posts/${id}?expand=premium_web_content`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch post ${id}: ${res.status}`);
  }

  return res.json();
}

async function fetchAllPosts() {
  let page = 1;
  const allPosts: PostData[] = [];

  while (true) {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/posts?limit=100&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch page ${page}: ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) break;

    console.log(data.data);

    for (const post of data.data) {
      await sleep(200);

      const fullPost = await fetchPostDetail(post.id);
      const actualPost = fullPost.data;

      const bodyMatch = actualPost.content.premium.web.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const doc = bodyMatch ? bodyMatch[1] : "";

      const mdx = `---
title: "${actualPost.title
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/"/g, "'")}"
slug: "${actualPost.slug}"
date: ${actualPost.publish_date * 1000}
description: "${actualPost.meta_default_description ? actualPost.meta_default_description
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/"/g, "'") : ""}"
hidden: ${actualPost.hidden_from_feed}
thumbnail_url: "${actualPost.thumbnail_url}"
web_exclusive: ${actualPost.content_tags.length > 0}
authors:
${actualPost.authors.map((author: string) => `- ${author}`).join("\n")}
---

${doc}

`;

      const filePath = path.join(CONTENT_DIR, `${actualPost.slug}.mdx`);
      fs.writeFileSync(filePath, mdx);

      allPosts.push(actualPost);
    };

    page++;
  }

  console.log(`Fetched ${allPosts.length} posts.`);
}

fetchAllPosts().catch((err) => {
  console.error("Error fetching archive:", err);
});
