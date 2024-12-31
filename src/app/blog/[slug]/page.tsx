"use client";

import "highlight.js/styles/atom-one-dark.css"; // Or whichever style you prefer
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import matter from "gray-matter";
import hljs from "highlight.js";
import Image from "next/image";
import { CalendarIcon, ClockIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Frontmatter {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [blogData, setBlogData] = useState<Frontmatter | null>(null);
  const [contentHtml, setContentHtml] = useState("");
  const [error, setError] = useState(false);

  // Scroll progress states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBar, setShowTopBar] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Prepare marked with syntax highlighting
  const customMarked = new Marked(
    markedHighlight({
      langPrefix: "language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      },
    }),
    {
      gfm: true,
      breaks: true,
    },
  );

  // Fetch Markdown file from public folder
  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const res = await fetch(`/blogs/${params.slug}.md`);
        if (!res.ok) throw new Error("Markdown file not found");

        const rawMd = await res.text();

        // 1) Parse frontmatter (YAML) and content
        const { data, content } = matter(rawMd);

        // 2) Replace references to process.env.XYZ with the actual values
        //    Only NEXT_PUBLIC_* vars are available on the client.
        let replacedContent = content.replace(
          /process\.env\.(\w+)/g,
          (_, envName) => {
            // We'll look up the env name in NEXT_PUBLIC_ + envName
            // e.g. process.env.SOME_VAR => process.env.NEXT_PUBLIC_SOME_VAR
            switch (envName) {
              case "NEXT_PUBLIC_APP_URL":
                return process.env.NEXT_PUBLIC_APP_URL || "";
              case "NEXT_PUBLIC_APP_NAME":
                return process.env.NEXT_PUBLIC_APP_NAME || "";
              default:
                return `process.env.${envName}`;
            }
          },
        );

        // 3) Convert frontmatter to your needed interface shape
        const fm: Frontmatter = {
          slug: data.slug ?? params.slug,
          title: data.title,
          excerpt: data.excerpt || "",
          publishedAt: data.publishedAt,
          readingTime: data.readingTime || "",
          author: {
            name: data.author?.name || "",
            role: data.author?.role || "",
            avatar: data.author?.avatar || "/founder-image.jpg",
          },
        };

        // 4) Convert the final replaced Markdown into HTML
        const htmlContent = customMarked.parse(replacedContent) as string;

        setBlogData(fm);
        setContentHtml(htmlContent);
      } catch (error) {
        setError(true);
      }
    }

    fetchMarkdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  // Handle scroll progress and top bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const progress = (scrollPosition / (fullHeight - windowHeight)) * 100;
      setScrollProgress(progress);
      setShowTopBar(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If there was an error fetching the file, show a simple fallback
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">404 – Blog not found</h1>
        <Link href="/blog">
          <Button variant="outline">Go back to Blogs</Button>
        </Link>
      </div>
    );
  }

  // If we haven't loaded data yet, show a loading state
  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading blog post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 z-10 ${
          showTopBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/blog" passHref>
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Button>
          </Link>
          <h2 className="text-sm font-semibold truncate max-w-[50%]">
            {blogData.title}
          </h2>
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-2 z-20">
        <Progress value={scrollProgress} className="h-full w-full" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Back to Blogs Link */}
        <Link href="/blog" passHref className="inline-block mb-8">
          <Button variant="outline" size="sm" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Button>
        </Link>

        {/* Article Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            {blogData.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <time dateTime={blogData.publishedAt}>
                {formatDistanceToNow(new Date(blogData.publishedAt), {
                  addSuffix: true,
                })}
              </time>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{blogData.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Author Info */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <Image
              src={blogData.author.avatar}
              alt={blogData.author.name}
              fill
              className="!relative !w-20 !h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{blogData.author.name}</h2>
              <p className="text-muted-foreground">{blogData.author.role}</p>
            </div>
          </div>
        </div>

        {/* Render HTML content with styled typography */}
        <article
          className="prose prose-lg dark:prose-invert max-w-none"
          ref={contentRef}
        >
          <div
            className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
      </div>
    </div>
  );
}
