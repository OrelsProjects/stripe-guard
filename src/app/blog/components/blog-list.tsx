"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Blog {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    avatar: string;
  };
  tags: string[];
}

interface BlogListProps {
  initialBlogs: Blog[];
  allTags: string[];
}

export function BlogList({ initialBlogs, allTags }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => blog.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [initialBlogs, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="space-y-8">
      {/* Search and filter section */}
      <div className="space-y-4 bg-card/50 p-6 rounded-xl backdrop-blur-sm">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm transition-all border-muted-foreground/20 hover:border-primary/50 focus:border-primary"
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card/50 backdrop-blur-sm">
          <div className="flex p-4 gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="flex-shrink-0 transition-all duration-200 hover:scale-105"
              >
                {tag}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Blog posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map(blog => (
          <Link
            href={`/blog/${blog.slug}`}
            key={blog.slug}
            className="group block bg-card rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {blog.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover ring-2 ring-background"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {blog.author.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <time dateTime={blog.publishedAt}>
                      {formatDistanceToNow(new Date(blog.publishedAt), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {blog.readingTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
