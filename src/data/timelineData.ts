
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
    title: "Red Team Operator",
    date: "2024 - Present",
    description: "Leading red team engagements and penetration testing. Researching new attack vectors.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 2,
    title: "CSIRT Expert",
    date: "2023 - Present",
    description: "Incident response, malware analysis, and forensic investigations.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 3,
    title: "Product Security Engineer",
    date: "2021 - 2024",
    description: "Securing TikTok E-Commerce products with security reviews and penetration tests.",
    category: "cybersecurity",
    icon: "Lock"
  },
  {
    id: 4,
    title: "Security Consultant",
    date: "2020 - 2021",
    description: "VAPT services and security reviews for clients across various industries.",
    category: "entrepreneurship",
    icon: "BarChart"
  },
  {
    id: 5,
    title: "Security Engineer",
    date: "2019 - 2020",
    description: "VAPT and compliance for military systems. Hardening critical infrastructure.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 6,
    title: "Red Team Intern",
    date: "2018 - 2019",
    description: "NFC card cloning research and CVSSv3 rating automation.",
    category: "cybersecurity",
    icon: "BugPlay"
  },
  {
    id: 7,
    title: "Penetration Tester Intern",
    date: "2018",
    description: "Automated analysis of cyber-attacks through attack simulations and log analysis.",
    category: "cybersecurity",
    icon: "Server"
  },
  {
    id: 8,
    title: "Full Stack Software Engineer",
    date: "2017",
    description: "Built web interfaces using React/Redux and Laravel for ShopBack platform.",
    category: "entrepreneurship",
    icon: "Code"
  },
  {
    id: 9,
    title: "CTF Team Leader",
    date: "2022 - 2023",
    description: "Led team 0x1EA7BEEF to top 15% rankings in local CTF competitions.",
    category: "teaching",
    icon: "Trophy"
  },
  {
    id: 10,
    title: "Cybersecurity Advisor",
    date: "2022 - 2023",
    description: "Advised gaming startup on security integration and best practices.",
    category: "teaching",
    icon: "BookOpen"
  }
];
