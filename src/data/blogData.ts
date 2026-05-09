
export type BlogCategory = "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";

export type BlogPostType = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  // A post can be tagged with one category or multiple (e.g. a phishing
  // simulation writeup that's both cybersecurity and teaching).
  category: BlogCategory | BlogCategory[];
  author: string;
  image: string;
  slug: string;
};

export const postCategories = (post: Pick<BlogPostType, 'category'>): BlogCategory[] =>
  Array.isArray(post.category) ? post.category : [post.category];

// Blog data removed as we're now fully relying on markdown files
export const blogData: BlogPostType[] = [];
