import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // tagsがなければ空配列を補完
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return { ...data, slug: realSlug, content, tags } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

// 全記事のタグと出現頻度を返す
export function getTagFrequencies(): { [tag: string]: number } {
  const posts = getAllPosts();
  const frequencies: { [tag: string]: number } = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      frequencies[tag] = (frequencies[tag] || 0) + 1;
    });
  });
  return frequencies;
}

// 全記事のタグ一覧（重複なし）を返す
export function getAllTags(): string[] {
  const frequencies = getTagFrequencies();
  return Object.keys(frequencies);
}
