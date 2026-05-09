import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { timelineData } from '@/data/timelineData';
import { useTimelineCalculations } from '@/hooks/useTimelineCalculations';
import { getMarkdownPosts, MarkdownPost } from '@/utils/markdown';
import HeroSection from '@/components/home/HeroSection';
import CertificationsSection from '@/components/home/CertificationsSection';
import RecentBlogPostsSection from '@/components/home/RecentBlogPostsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const Index = () => {
  // Posts now live as markdown files under content/blog/, so load them at
  // mount instead of pulling from the (empty) static blogData array.
  const [recentPosts, setRecentPosts] = useState<MarkdownPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    getMarkdownPosts()
      .then((posts) => {
        if (cancelled) return;
        const sorted = [...posts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentPosts(sorted.slice(0, 3));
      })
      .catch((err) => console.error('Failed to load recent posts:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Use the same hook as the Timeline page to ensure consistency
  const { level, currentLevelXP, xpToNextLevel, totalExperience, skills } = useTimelineCalculations(timelineData);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection 
        level={level}
        currentLevelXP={currentLevelXP}
        xpToNextLevel={xpToNextLevel}
        skills={skills}
      />
      
      {/* Certifications Section */}
      <CertificationsSection />
      
      {/* Recent Blog Posts Section */}
      <RecentBlogPostsSection recentPosts={recentPosts} />
      
      {/* Call to Action Section */}
      <CallToActionSection />
      
      <Footer />
    </div>
  );
};

export default Index;
