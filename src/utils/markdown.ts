
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
    // Use Vite's import.meta.glob to import all markdown files
    const markdownFiles = import.meta.glob('/content/blog/*.md', { eager: true, as: 'raw' });
    
    if (Object.keys(markdownFiles).length === 0) {
      console.warn('No markdown files found in content/blog directory');
      return [];
    }
    
    const posts = Object.entries(markdownFiles).map(([filePath, content], index) => {
      // Extract slug from file path
      const slug = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
      
      // Parse frontmatter and content
      const { data, content: markdownContent } = matter(content as string);
      
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
    // Return empty array instead of falling back to blogData
    return [];
  }
};
