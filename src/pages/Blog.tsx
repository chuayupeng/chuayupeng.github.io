import { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import FilterButtons from '@/components/FilterButtons';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getMarkdownPosts, MarkdownPost } from '@/utils/markdown';

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<MarkdownPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadPosts() {
      try {
        const markdownPosts = await getMarkdownPosts();
        setPosts(markdownPosts);
      } catch (error) {
        console.error('Failed to load markdown posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadPosts();
  }, []);
  
  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  const filteredPosts = posts
    .filter(post => 
      (activeFilter === 'all' || post.category === activeFilter) &&
      (searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog & Insights</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, tutorials, and perspectives on various areas of specialisation.
            </p>
          </div>
          
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <FilterButtons 
            activeFilter={activeFilter} 
            setActiveFilter={setActiveFilter}
            categories={categories}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {loading ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground">
                  No posts found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
