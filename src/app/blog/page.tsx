import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogList } from "./components/blog-list";
import Logo from "@/components/ui/Logo";

export default function BlogsPage() {
  const blogsDir = path.join(process.cwd(), "public/blogs");
  const filenames = fs.readdirSync(blogsDir);

  const blogs = filenames
    .filter(filename => filename.endsWith(".md"))
    .map(filename => {
      const filePath = path.join(blogsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      return {
        slug: filename.replace(/\.md$/, ""),
        title: data.title || "",
        excerpt: data.excerpt || "",
        publishedAt: data.publishedAt || "",
        readingTime: data.readingTime || "5 min read",
        author: data.author || {
          name: "Unknown Author",
          avatar: "/default-avatar.png",
        },
        tags: data.tags || [],
      };
    });

  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header Bar */}
      <header className="sticky top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
        <div className="container flex h-14 items-center">
          <Logo navigateOnClick />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Our Blog
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Discover our latest thoughts, ideas, and insights
        </p>
        <BlogList initialBlogs={blogs} allTags={allTags} />
      </main>
    </div>
  );
}
