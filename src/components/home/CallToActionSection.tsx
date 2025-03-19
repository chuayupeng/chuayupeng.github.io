
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="py-20 px-4 bg-cyber-blue text-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold mb-4">Join My Guild</h2>
        <p className="text-cyber-slate max-w-2xl mx-auto mb-8">
          Whether you seek cybersecurity consulting, knowledge sharing, or collaborative quests, I'm ready to adventure together.
        </p>
        <Button asChild size="lg" className="bg-cyber-cyan text-cyber-blue hover:bg-cyber-cyan/80">
          <Link to="/about">Form Party</Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
