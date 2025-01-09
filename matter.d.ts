declare module "gray-matter" {
  interface GrayMatterFile<T = any> {
    data: T & {
      title?: string;
      excerpt?: string;
      publishedAt?: string;
      readingTime?: string;
      author?: {
        name: string;
        avatar: string;
      };
      tags?: string[];
    };
    content: string;
    excerpt?: string;
    orig: Buffer;
    language: string;
    matter: string;
    stringify(): string;
  }

  function matter<T = any>(input: any, options?: any): GrayMatterFile<T>;

  export = matter;
}
