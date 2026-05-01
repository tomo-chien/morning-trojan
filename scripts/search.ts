import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const OUTPUT_FILE = path.join(PUBLIC_DIR, "search-index.json");

// Utility: strip MDX/JSX tags and compress whitespace
function cleanContent(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ") // remove HTML/JSX tags
    .replace(/\{[^}]+\}/g, " ") // remove curly brace expressions
    .replace(/import\s.+from\s.+;?/g, " ") // remove imports
    .replace(/export\s.+/g, " ") // remove exports
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

function getAllPosts() {
  const files = fs.readdirSync(CONTENT_DIR);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(CONTENT_DIR, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { content, data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        hidden: data.hidden ?? false,
        web_exclusive: data.web_exclusive ?? false,
        content: cleanContent(content), // cleaned text
      };
    });
}

function buildIndex() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const posts = getAllPosts();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts));
  console.log(`✅ Search index written to ${OUTPUT_FILE}`);
}

buildIndex();
