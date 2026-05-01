import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content");

export interface PostData {
  title: string;
  date: number;
  description: string;
  slug: string;
  hidden: boolean;
  thumbnail_url: string;
  web_exclusive: boolean;
  greatest_hit: boolean;
  authors: string[];
}

/**
 * Fetches all newsletter entries, sorts them by date, and returns
 * their metadata and slugs.
 *
 * @returns {Array} An array of objects with sorted newsletter data.
 */
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const allPostsData = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    return {
      ...(matterResult.data as PostData),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Fetches the data for a single newsletter entry by its slug.
 *
 * @param {string} slug The slug of the newsletter to fetch.
 * @returns {Object} An object containing the post's metadata and content.
 */
export async function getPostData(slug: string): Promise<PostData & { content: string }> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  return {
    content: matterResult.content,
    ...(matterResult.data as PostData),
  };
}

/**
 * Gets all available slugs for pre-rendering with generateStaticParams.
 *
 * @returns {Array} An array of objects with a slug for each newsletter.
 */
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));
  return fileNames.map((fileName) => {
    return {
      slug: fileName.replace(/\.mdx$/, ""),
    };
  });
}
