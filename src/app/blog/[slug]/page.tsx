"use client";

import "highlight.js/styles/atom-one-dark.css"; // Replace 'github' with your preferred style
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import Image from "next/image";
import { CalendarIcon, ClockIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { blogs } from "@/lib/blogs";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const blog = blogs[params.slug as keyof typeof blogs];
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTopBar, setShowTopBar] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!blog) {
    notFound();
  }

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language, ignoreIllegals: true }).value;
      },
    }),
  );
  // Convert Markdown content to HTML
  const contentHtml = marked.parse(blog.content);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Calculate scroll progress
      const progress = (scrollPosition / (fullHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      // Show top bar after scrolling 100px
      setShowTopBar(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            {blog.title}
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
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <time dateTime={blog.publishedAt}>
                {formatDistanceToNow(new Date(blog.publishedAt), {
                  addSuffix: true,
                })}
              </time>
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-2" />
              <span>{blog.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Author Info */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <Image
              src={blog.author.avatar}
              alt={blog.author.name}
              fill
              className="!relative !w-20 !h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{blog.author.name}</h2>
              <p className="text-muted-foreground">{blog.author.role}</p>
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

        {/* Back to Blogs Link (Bottom) */}
        <div className="mt-12 text-center">
          <Link href="/blog" passHref>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center mx-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blogs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
