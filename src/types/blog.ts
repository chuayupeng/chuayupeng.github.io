
export type BlogPostType = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";
  author: string;
  image: string;
  slug: string;
};
