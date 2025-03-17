
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
    description: "Leading red team engagements, phishing simulations and penetration testing for the firm. Conducted vulnerability research on new attack vectors.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 2,
    title: "CSIRT Expert",
    date: "2023 - Present",
    description: "Incident Response team work, reverse engineering malware, investigations into incidents, and launching full investigations into attack scenarios.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 3,
    title: "Product Security Engineer",
    date: "2021 - 2024",
    description: "Ensured secure development for TikTok Global E-Commerce products, conducted over 10,000 security reviews and penetration tests.",
    category: "cybersecurity",
    icon: "Lock"
  },
  {
    id: 4,
    title: "Security Consultant",
    date: "2020 - 2021",
    description: "Conducted full VAPT services, configuration reviews, and testing for infrastructural and web applications for a wide range of clients.",
    category: "entrepreneurship",
    icon: "BarChart"
  },
  {
    id: 5,
    title: "Security Engineer",
    date: "2019 - 2020",
    description: "Performed VAPT services and compliance checks on internal military systems. Set up and hardened systems for critical situations.",
    category: "cybersecurity",
    icon: "Shield"
  },
  {
    id: 6,
    title: "Red Team Intern",
    date: "2018 - 2019",
    description: "Researched on NFC cards to operationalize cloning attacks for red teaming. Created a bot that generates CVSSv3 ratings.",
    category: "cybersecurity",
    icon: "BugPlay"
  },
  {
    id: 7,
    title: "Penetration Tester Intern",
    date: "2018",
    description: "Enabled automated analysis of cyber-attacks by simulating attacks on vulnerable servers and recording relevant logs.",
    category: "cybersecurity",
    icon: "Server"
  },
  {
    id: 8,
    title: "Full Stack Software Engineer Intern",
    date: "2017",
    description: "Implemented internal interfaces using React/Redux and Laravel. Developed features for the ShopBack platform.",
    category: "entrepreneurship",
    icon: "Code"
  },
  {
    id: 9,
    title: "CTF Team Leader",
    date: "2022 - 2023",
    description: "Created and led a team (0x1EA7BEEF) for multiple CTFs, placing within the top 15% of local CTF competitions.",
    category: "teaching",
    icon: "Trophy"
  },
  {
    id: 10,
    title: "Cybersecurity Advisor",
    date: "2022 - 2023",
    description: "Advised Stealth Gaming Startup on security matters, integrating SemGrep Code and providing security advice.",
    category: "teaching",
    icon: "BookOpen"
  }
];
