// app/[slug]/layout.tsx
import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import loggerServer from "@/loggerServer";

// 1. Define dynamic SEO-related metadata based on markdown frontmatter
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = params;

  // Read the markdown file
  const url = process.env.NEXT_PUBLIC_APP_URL + "/blogs/" + slug + ".md";

  try {
    // get file from the url.
    const fileContents = await fetch(url).then(res => res.text());
    const { data } = matter(fileContents);

    // Extract metadata from frontmatter
    const metadata = {
      title: data.title,
      description: data.excerpt,
      keywords: ["Accessibility", slug, "WCAG", "A11y"],
      openGraph: {
        title: data.title,
        description: data.excerpt,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`,
        siteName: "Shadcn Themes",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_OG_IMAGES_URL}/blogs/${slug}.png`,
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.excerpt,
        images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image-${slug}.png`],
        creator: "@YourTwitterHandle",
      },
    };

    return metadata;
  } catch (error) {
    console.error("Error reading file", error);
    loggerServer.error("Error reading file", "", { data: error });
  }
}


// 2. Optional: Add a JSON-LD script for structured data
function StructuredData({ metadata }: { metadata: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: metadata.title,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/resources/blogs/${metadata.slug}`,
    operatingSystem: "All",
    applicationCategory: "DesignApplication",
    description: metadata.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  return (
    <>
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/${slug}`}
      />
      <StructuredData metadata={generateMetadata({ params })} />
      <main>{children}</main>
    </>
  );
}
