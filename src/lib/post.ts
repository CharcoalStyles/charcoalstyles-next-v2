import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const env = process.env.NODE_ENV || "development";

type AllPostDetails = {
  section: string;
  slug: string;
  post: matter.GrayMatterFile<string>;
};

export type PostMetadata = Post & Metadata;

export type Post = {
  content: string;
};

export type Metadata = {
  created: number;
  excerpt: string;
  modified: number | null;
  section: string;
  slug: string;
  tags: Array<string>;
  title: string;
};

const getAllPosts = () => {
  const allPosts: Array<AllPostDetails> = [];
  fs.readdirSync(`src/markdown`).forEach((file) => {
    const realSlug = file.replace(/\.md$/, "").replace(/[ ]+/g, "-");
    const fullPath = join("src/markdown", file);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    if (env === "development" || file.substr(0, 1) !== "!") {
      const post = matter(fileContents, {
        excerpt: true,
      });

      allPosts.push({
        section: post.data["section"],
        slug: realSlug,
        post,
      });
    }
  });
  return allPosts;
};

const extractPostMetadata = ({ slug, post }: AllPostDetails): Metadata => {
  return {
    created: (post.data["created"] as Date).getTime(),
    excerpt: post.excerpt || "",
    modified: post.data["modified"]
      ? (post.data["modified"] as Date).getTime()
      : null,
    section: post.data["section"] ? post.data["section"] : null,
    slug: slug,
    tags: post.data["tags"],
    title: post.data["title"],
  };
};

export const getAllPostsMetadata = () => {
  const allPosts = getAllPosts();

  return allPosts
    .map((apd: AllPostDetails): Metadata => extractPostMetadata(apd))
    .filter((post) => post.section !== null);
};

export const getPost = (
  requestedSlug: string,
  requestedSection: string
): PostMetadata => {
  const post = getAllPosts().find(
    ({ slug, section }) =>
      slug === requestedSlug && section === requestedSection
  );
  if (!post) {
    throw new Error("Post not found");
  }
  const metadata = extractPostMetadata(post);
  return { ...metadata, content: post.post.content };
};

export const getAllSectionPostsMetadata = (requestedSection: string) => {
  const allPosts = getAllPosts().filter(
    ({ section }) => section === requestedSection
  );

  return allPosts.map(extractPostMetadata);
};

export const getAllTagPostsMetadata = (tag: string) => {
  const allPosts = getAllPosts().filter(({ post }) =>
    post.data["tags"].includes(tag)
  );

  return allPosts.map(extractPostMetadata);
};

export const getAllSections = () => fs.readdirSync(`src/markdown`);
