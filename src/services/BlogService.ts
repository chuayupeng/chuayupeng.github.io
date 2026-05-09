import { getMarkdownPosts, MarkdownPost } from '@/utils/markdown';
import { blogData } from '@/data/blogData';

/**
 * Service for managing blog posts
 */
export class BlogService {
  /**
   * Loads blog posts from markdown files, with fallback to static data
   */
  static async getPosts(): Promise<MarkdownPost[]> {
    try {
      // Try to load posts from markdown files first
      const markdownPosts = await getMarkdownPosts();
      
      // If we found markdown posts, use them
      if (markdownPosts && markdownPosts.length > 0) {
        return markdownPosts;
      }
      
      // Otherwise fall back to static data
      console.log('No markdown posts found, using fallback data');
      return blogData;
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      // Return static data as fallback
      return blogData;
    }
  }
  
  /**
   * Gets a single blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<MarkdownPost | null> {
    const posts = await this.getPosts();
    return posts.find(post => post.slug === slug) || null;
  }
  
  /**
   * Gets related posts (any overlapping category, excluding the given post).
   */
  static async getRelatedPosts(post: MarkdownPost, limit: number = 3): Promise<MarkdownPost[]> {
    const posts = await this.getPosts();
    const target = new Set(Array.isArray(post.category) ? post.category : [post.category]);
    return posts
      .filter(p => {
        if (p.id === post.id) return false;
        const pcats = Array.isArray(p.category) ? p.category : [p.category];
        return pcats.some(c => target.has(c));
      })
      .slice(0, limit);
  }
}
