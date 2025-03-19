
import { Star } from 'lucide-react';
import { Swords, Radar, Bug, ChefHat } from 'lucide-react';

interface Certification {
  title: string;
  description: string;
  icon: any;
  iconClass: string;
  bgClass: string;
  stars: number;
}

const CertificationsSection = () => {
  const certifications: Certification[] = [
    {
      title: 'OSCP (2019)',
      description: 'Offensive Security Certified Professional',
      icon: Swords,
      iconClass: 'text-red-500 dark:text-red-400',
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      stars: 3
    },
    {
      title: 'CPSA (2019-2022)',
      description: 'CREST Practitioner Security Analyst (Expired)',
      icon: Radar,
      iconClass: 'text-blue-300 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-900/30',
      stars: 1
    },
    {
      title: 'CRT (2019-2022)',
      description: 'CREST Registered Penetration Tester (Expired)',
      icon: Bug,
      iconClass: 'text-red-300 dark:text-red-400',
      bgClass: 'bg-red-50 dark:bg-red-900/30',
      stars: 2
    },
    {
      title: 'OSWE (2020)',
      description: 'Offensive Security Web Expert',
      icon: Bug,
      iconClass: 'text-purple-600 dark:text-purple-400',
      bgClass: 'bg-purple-100 dark:bg-purple-900/30',
      stars: 4
    },
    {
      title: 'CRTO (2021)',
      description: 'Certified Red Team Operator',
      icon: Radar,
      iconClass: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-100 dark:bg-red-900/30',
      stars: 2
    },
    {
      title: 'WSQ FSC L3 (2024)',
      description: 'Food Safety and Hygiene Officer',
      icon: ChefHat,
      iconClass: 'text-yellow-600 dark:text-yellow-400',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
      stars: 3
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-cyber-navy">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Industry Certifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlocking levels of cross-disciplinary expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certifications.map((spec, index) => (
            <div key={index} className="rpg-card bg-white dark:bg-cyber-navy p-6">
              <div className={`w-12 h-12 ${spec.bgClass} rounded-full flex items-center justify-center mb-4 animate-pulse-glow`}>
                <spec.icon className={`w-6 h-6 ${spec.iconClass}`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{spec.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {spec.description}
              </p>
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < spec.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {spec.stars === 5 ? 'Legendary' : spec.stars === 4 ? 'Epic' : spec.stars === 3 ? 'Rare': spec.stars === 2 ? 'Uncommon' : 'Common'} Specialization
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
