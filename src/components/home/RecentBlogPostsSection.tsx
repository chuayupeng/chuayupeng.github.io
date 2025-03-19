
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BlogPostType } from '@/data/blogData';

interface RecentBlogPostsSectionProps {
  recentPosts: BlogPostType[];
}

const RecentBlogPostsSection = ({ recentPosts }: RecentBlogPostsSectionProps) => {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-cyber-navy">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Quest Scrolls</h2>
            <p className="text-muted-foreground">
              Wisdom and knowledge gathered during adventures.
            </p>
          </div>
          <Button asChild variant="ghost" className="text-cyber-cyan">
            <Link to="/blog" className="flex items-center">
              View all scrolls <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map(post => (
            <div key={post.id} className="rpg-card bg-white dark:bg-cyber-blue rounded-lg overflow-hidden">
              <Link to={`/blog/${post.slug}`} className="block">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${post.image})` }}
                >
                  {/* Decorative frame corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
                </div>
              </Link>
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-opacity-10 text-cyber-cyan bg-cyber-cyan">
                    {post.category}
                  </span>
                  
                  {/* Quest Rarity */}
                  <div className="float-right flex items-center">
                    {[...Array(post.id <= 2 ? 5 : post.id <= 4 ? 4 : post.id <= 6 ? 3 : 2)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className="text-yellow-400 fill-yellow-400" 
                      />
                    ))}
                  </div>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-xl mb-2 hover:text-cyber-cyan transition-colors">{post.title}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="text-cyber-cyan hover:text-cyber-cyan/80 font-medium text-sm inline-flex items-center"
                  >
                    Begin Quest <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBlogPostsSection;
