import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BlogPostType } from '@/data/blogData';

interface RecentBlogPostsSectionProps {
  recentPosts: BlogPostType[];
}

const RecentBlogPostsSection = ({ recentPosts }: RecentBlogPostsSectionProps) => {
  return (
    <section className="py-24 px-4 bg-card/40 border-y border-white/[0.04]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="section-eyebrow">Writing</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Recent posts
            </h2>
            <p className="text-muted-foreground">
              Notes and write-ups from research, engagements, and side projects.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center text-sm font-medium text-cyber-cyan hover:text-cyber-cyan/80"
          >
            View all
            <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPosts.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="card-surface overflow-hidden group flex flex-col"
            >
              <div className="aspect-[16/9] overflow-hidden bg-secondary">
                <div
                  className="w-full h-full bg-cover bg-left transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-mono">
                  <span className="text-cyber-cyan">
                    {(Array.isArray(post.category) ? post.category : [post.category]).join(' | ')}
                  </span>
                  <span className="opacity-40">·</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 leading-snug group-hover:text-cyber-cyan transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <span className="mt-auto inline-flex items-center text-sm font-medium text-cyber-cyan">
                  Read post
                  <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBlogPostsSection;
