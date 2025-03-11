
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogPostType } from '@/data/blogData';

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

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const gradientColors = getBgColor(post.category);
  
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col cursor-pointer">
        <div 
          className="h-48 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${post.image})`,
            position: 'relative'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${gradientColors} text-white`}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <h3 className="font-bold text-xl mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-1" />
            <span>{post.date}</span>
          </div>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-0">
          <span className="inline-flex items-center text-cyber-cyan hover:text-cyber-cyan/80 transition-colors font-medium">
            Read more <ArrowRight size={16} className="ml-1" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;
