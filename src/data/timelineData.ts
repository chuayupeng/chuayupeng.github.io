
export type TimelineItemType = {
  id: number;
  title: string;
  date: string;
  description: string;
  category: "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";
  icon: string;
};

export const timelineData: TimelineItemType[] = [
  {
    id: 1,
    title: "Chief Security Officer",
    date: "2021 - Present",
    description: "Leading security operations for a global tech company. Established robust security protocols and led a team of security professionals.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 2,
    title: "Opened F&B Venture",
    date: "2020 - Present",
    description: "Co-founded an innovative food concept combining traditional flavors with modern techniques, focusing on sustainable practices.",
    category: "f&b",
    icon: "Utensils"
  },
  {
    id: 3,
    title: "Cybersecurity Workshop Instructor",
    date: "2019 - Present",
    description: "Teaching cybersecurity fundamentals to professionals and students. Developed curriculum that bridges theoretical knowledge with practical applications.",
    category: "teaching",
    icon: "GraduationCap"
  },
  {
    id: 4,
    title: "Security Consultant",
    date: "2018 - 2021",
    description: "Provided strategic security consulting for Fortune 500 companies. Conducted risk assessments and penetration testing.",
    category: "cybersecurity",
    icon: "BarChart"
  },
  {
    id: 5,
    title: "Tech Startup Founder",
    date: "2017 - 2020",
    description: "Founded a security-focused SaaS startup that provided innovative solutions for small businesses. Successfully grew and exited.",
    category: "entrepreneurship",
    icon: "Rocket"
  },
  {
    id: 6,
    title: "University Guest Lecturer",
    date: "2016 - 2019",
    description: "Served as guest lecturer for Computer Science department, specializing in network security and ethical hacking courses.",
    category: "teaching",
    icon: "BookOpen"
  },
  {
    id: 7,
    title: "F&B Consultant",
    date: "2015 - 2018",
    description: "Provided operational consulting for restaurants and cafes, helping with menu development, cost optimization, and customer experience enhancement.",
    category: "f&b",
    icon: "Coffee"
  },
  {
    id: 8,
    title: "Senior Security Engineer",
    date: "2014 - 2018",
    description: "Designed and implemented security infrastructure for cloud-based applications. Specialized in identity management and access control.",
    category: "cybersecurity",
    icon: "Lock"
  },
  {
    id: 9,
    title: "Culinary Training Program",
    date: "2013 - 2015",
    description: "Completed professional culinary program while working in security, developing skills in various cooking techniques and food science.",
    category: "f&b",
    icon: "ChefHat"
  },
  {
    id: 10,
    title: "Business Incubator Mentor",
    date: "2012 - 2016",
    description: "Mentored early-stage startups on security best practices and business development strategies. Helped several companies secure initial funding.",
    category: "entrepreneurship",
    icon: "Users"
  }
];
