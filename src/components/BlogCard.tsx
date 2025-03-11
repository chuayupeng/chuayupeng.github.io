
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen, Star } from 'lucide-react';
import { BlogPostType } from '@/data/blogData';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostType;
}

const getBgColor = (category: BlogPostType['category']) => {
  switch (category) {
    case 'cybersecurity':
      return 'from-blue-500 to-blue-600';
    case 'teaching':
      return 'from-green-500 to-green-600';
    case 'f&b':
      return 'from-amber-500 to-amber-600';
    case 'entrepreneurship':
      return 'from-purple-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

// Calculate "rarity" based on blog post id
const getPostRarity = (id: number) => {
  if (id <= 2) return { stars: 5, label: 'Legendary' };
  if (id <= 4) return { stars: 4, label: 'Epic' };
  if (id <= 6) return { stars: 3, label: 'Rare' };
  return { stars: 2, label: 'Common' };
};

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const gradientColors = getBgColor(post.category);
  const rarity = getPostRarity(post.id);
  
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full group">
      <Card className="overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer rpg-border bg-card/95 backdrop-blur-sm hover:shadow-xl">
        <div 
          className="h-48 bg-cover bg-center relative overflow-hidden" 
          style={{ 
            backgroundImage: `url(${post.image})`,
            position: 'relative'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Decorative frame corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
          
          <div className="absolute left-0 bottom-0 p-3 w-full">
            {/* Category badge */}
            <span className={cn(
              "inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r text-white shadow-md",
              gradientColors
            )}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
            
            {/* Rarity indicator with stars */}
            <div className="absolute right-3 bottom-3 flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={i < rarity.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="mb-2 flex items-center text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <BookOpen size={14} className="mr-1" />
            <span>{post.readTime} min read</span>
          </div>
          
          <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
          
          <div className="flex justify-between items-center pt-2 border-t border-muted">
            <span className="text-xs text-muted-foreground">{rarity.label} Article</span>
            <span className="inline-flex items-center text-cyber-cyan hover:text-cyber-cyan/80 transition-colors font-medium text-sm">
              Read Quest <ArrowRight size={14} className="ml-1" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
