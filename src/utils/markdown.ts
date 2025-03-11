
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

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
  try {
    const contentDir = path.join(process.cwd(), 'content', 'blog');
    
    // Check if directory exists, if not, return empty array
    if (!fs.existsSync(contentDir)) {
      console.warn('Content directory does not exist: ', contentDir);
      return [];
    }
    
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = await Promise.all(
      markdownFiles.map(async (file, index) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        const slug = file.replace(/\.md$/, '');
        
        return {
          id: index + 1,
          title: data.title || 'Untitled Post',
          excerpt: data.excerpt || '',
          content: md.render(content),
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
      })
    );
    
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading markdown posts:', error);
    return [];
  }
};
