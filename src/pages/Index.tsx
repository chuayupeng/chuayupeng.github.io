
import { Trophy, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogData } from '@/data/blogData';
import { timelineData } from '@/data/timelineData';
import { useTimelineCalculations } from '@/hooks/useTimelineCalculations';
import HeroSection from '@/components/home/HeroSection';
import CertificationsSection from '@/components/home/CertificationsSection';
import RecentBlogPostsSection from '@/components/home/RecentBlogPostsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const Index = () => {
  // Get the 3 most recent blog posts
  const recentPosts = [...blogData].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 3);
  
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
