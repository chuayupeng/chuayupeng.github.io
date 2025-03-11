
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { BlogPostType } from '@/types/blog';

// Content directory containing Markdown files
const contentDir = path.join(process.cwd(), 'src/content/blog');

// Function to read all blog posts
export async function getAllPosts(): Promise<BlogPostType[]> {
  try {
    // Get all Markdown files from the content directory
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    // Read and parse each Markdown file
    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Use gray-matter to parse the front matter
        const { data, content } = matter(fileContent);
        
        // Convert the Markdown content to HTML
        const htmlContent = marked.parse(content) as string;
        
        // Return the post data with parsed content
        return {
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          content: htmlContent,
          date: data.date,
          category: data.category,
          author: data.author,
          image: data.image,
          slug: data.slug,
        } as BlogPostType;
      })
    );

    // Sort posts by date (most recent first)
    return posts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Function to get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPostType | null> {
  try {
    const posts = await getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}
