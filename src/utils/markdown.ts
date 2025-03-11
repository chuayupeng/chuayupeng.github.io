
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { blogData } from '@/data/blogData';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export interface MarkdownPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";
  author: string;
  image: string;
  slug: string;
}

export const getMarkdownPosts = async (): Promise<MarkdownPost[]> => {
  // For now, return the static blog data
  // In a real application, this would fetch from an API endpoint
  // that processes markdown files server-side
  return blogData;
};

