
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { getMarkdownPosts, MarkdownPost } from '@/utils/markdown';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<MarkdownPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<MarkdownPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const markdownPosts = await getMarkdownPosts();
        
        const foundPost = markdownPosts.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          
          // Find related posts (same category, excluding current post)
          const related = markdownPosts
            .filter(item => item.category === foundPost?.category && item.id !== foundPost?.id)
            .slice(0, 3);
            
          setRelatedPosts(related);
        } else {
          // No post found with matching slug
          setPost(null);
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
        setPost(null);
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadPost();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading post...</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div 
          className="w-full h-96 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${post?.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
          <div className="container mx-auto px-4 max-w-4xl relative h-full flex flex-col justify-end pb-12">
            <div className="mb-4">
              <span className="px-3 py-1 bg-cyber-cyan text-cyber-blue text-sm font-medium rounded-full">
                {post?.category.charAt(0).toUpperCase() + post?.category.slice(1)}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{post?.title}</h1>
            <div className="flex flex-wrap items-center text-white/80 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span className="text-sm">{post?.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span className="text-sm">{post?.author}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-cyber-navy shadow-md rounded-lg -mt-16 relative z-10 p-8 mb-16">
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content || '' }}
            />
          </div>
          
          {/* Author Bio */}
          <div className="bg-gray-50 dark:bg-cyber-navy/50 rounded-lg p-6 mb-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 bg-cyber-cyan rounded-full text-center flex items-center justify-center text-2xl font-bold text-cyber-blue">
                {post?.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{post?.author}</h3>
                <p className="text-muted-foreground text-sm">
                  Expert in cybersecurity and technology with over 5 years of industry experience. Passionate about sharing knowledge.
                </p>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(related => (
                  <Link 
                    key={related.id} 
                    to={`/blog/${related.slug}`}
                    className="bg-white dark:bg-cyber-navy rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${related.image})` }}
                    ></div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{related.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={14} className="mr-1" />
                        <span>{related.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft size={16} className="mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
