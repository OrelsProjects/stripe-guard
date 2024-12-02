import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { blogs } from '@/lib/blogs';

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl !leading-[4rem] font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Our Blog Posts
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {Object.values(blogs).map((blog) => (
            <Link 
              href={`/blog/${blog.slug}`} 
              key={blog.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{blog.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      fill
                      className="!relative !w-10 !h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{blog.author.name}</p>
                      <p className="text-xs text-muted-foreground">{blog.author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <time dateTime={blog.publishedAt}>
                      {formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
