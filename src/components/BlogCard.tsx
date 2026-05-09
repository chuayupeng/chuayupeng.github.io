
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPostType, BlogCategory, postCategories } from '@/data/blogData';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostType;
}

const getBgColor = (category: BlogCategory) => {
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

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const cats = postCategories(post);
  
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full group">
      <Card className="overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer rpg-border bg-card/95 backdrop-blur-sm border-white/[0.06] hover:border-cyber-cyan/40 hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.45)] hover:-translate-y-0.5">
        <div className="relative h-48 m-2">
          {/* Rounded image + overlays clipped to the rounded shape */}
          <div className="absolute inset-0 rounded-lg overflow-hidden border border-white/[0.06]">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover object-left"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute left-0 bottom-0 p-3 w-full">
              {/* Category badges — one pill per tagged category. */}
              <div className="flex flex-wrap gap-1.5">
                {cats.map((cat) => (
                  <span
                    key={cat}
                    className={cn(
                      'inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r text-white shadow-md',
                      getBgColor(cat)
                    )}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* L-shaped glowing frame corners — each one's outer corner is
              rounded with the same radius (rounded-lg = 8px) as the image
              underneath, so the bracket arc hugs the rounded picture
              instead of sticking out as a square. */}
          <div className="pointer-events-none absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyber-cyan rounded-tl-lg drop-shadow-[0_0_4px_rgba(139,92,246,0.7)]" />
          <div className="pointer-events-none absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyber-cyan rounded-tr-lg drop-shadow-[0_0_4px_rgba(139,92,246,0.7)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyber-cyan rounded-bl-lg drop-shadow-[0_0_4px_rgba(139,92,246,0.7)]" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyber-cyan rounded-br-lg drop-shadow-[0_0_4px_rgba(139,92,246,0.7)]" />
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="mb-2 flex items-center text-xs text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <BookOpen size={14} className="mr-1" />
            <span>{post.id % 10 + 3} min read</span>
          </div>
          
          <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
          
          <div className="flex justify-end items-center pt-2 border-t border-muted">
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
