
import { Buffer } from 'buffer';

// Polyfill Buffer for browsers
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

import yaml from 'js-yaml';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

// Minimal frontmatter parser (replaces gray-matter, which pinned a vulnerable
// js-yaml 3.x). Splits a leading `---` YAML block from the markdown body.
const FRONTMATTER = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  const m = FRONTMATTER.exec(raw);
  if (!m) return { data: {}, content: raw };
  let data: Record<string, any> = {};
  try {
    const parsed = yaml.load(m[1]);
    if (parsed && typeof parsed === 'object') data = parsed as Record<string, any>;
  } catch { /* malformed frontmatter — treat as none */ }
  return { data, content: raw.slice(m[0].length) };
}

export type MarkdownCategory = "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";

export interface MarkdownPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  // YAML frontmatter may provide a single category string or an array.
  category: MarkdownCategory | MarkdownCategory[];
  author: string;
  image: string;
  slug: string;
}

export const getMarkdownPosts = async (): Promise<MarkdownPost[]> => {
  try {
    // Use Vite's import.meta.glob to import all markdown files
    const markdownFiles = import.meta.glob('/content/blog/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    });
    
    if (Object.keys(markdownFiles).length === 0) {
      console.warn('No markdown files found in content/blog directory');
      return [];
    }
    
    const posts = Object.entries(markdownFiles).map(([filePath, content], index) => {
      // Extract slug from file path
      const slug = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
      
      // Parse frontmatter and content
      const { data, content: markdownContent } = parseFrontmatter(content as string);
      
      return {
        id: index + 1,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || '',
        content: md.render(markdownContent),
        date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : new Date().toLocaleDateString(),
        category: data.category || 'cybersecurity',
        author: data.author || 'Unknown Author',
        image: data.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        slug
      } as MarkdownPost;
    });
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error processing markdown files:', error);
    return [];
  }
};
