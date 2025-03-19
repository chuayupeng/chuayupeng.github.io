
export type CategoryType = "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";

export type TimelineItemType = {
  coy: string;
  id: number;
  title: string;
  date: string;
  description: string;
  category: CategoryType | CategoryType[];
  icon: string;
};

export const timelineData: TimelineItemType[] = [
  {
    id: 5,
    title: "Information Security Practitioner",
    date: "2024 - Present",
    description: "Protecting the fund by uncovering legacy risks and threats. Brought an offensive mindset into a defensive role.",
    category: "cybersecurity",
    icon: "Shield",
    coy: "Symmetry Investments"
  },
  {
    id: 53,
    title: "Computer Science Teacher",
    date: "2024 - Present",
    description: "Taught Computer Science for Cambridge AS and A Levels Examinations.",
    category: "teaching",
    icon: "BookOpen",
    coy: "Furen International School"
  },
  {
    id: 9,
    title: "Co-Founder",
    date: "2024 - 2024",
    description: "Created original recipes and helped open a stall at Marketplace@Expo.",
    category: ["f&b", "entrepreneurship"],
    icon: "ChefHat",
    coy: "WhiteHatOne Pte Ltd/Cloud Bingsu"
  },
  {
    id: 39,
    title: "CSIRT Member",
    date: "2023 - Present",
    description: "Conducted incident response, malware analysis, and forensic investigations under military service.",
    category: "cybersecurity",
    icon: "Shield",
    coy: "Digital Intelligence Services"
  },
  {
    id: 51,
    title: "Red Team Member",
    date: "2023 - 2024",
    description: "Freelance penetration testing services.",
    category: "cybersecurity",
    icon: "Swords",
    coy: "Synack Red Team"
  },
  {
    id: 52,
    title: "Cybersecurity Advisor",
    date: "2022 - 2023",
    description: "Advised stealth gaming startup on security integration and best practices.",
    category: ["entrepreneurship", "cybersecurity"],
    icon: "BookOpen",
    coy: "_______________________"
  },
  {
    id: 35,
    title: "Product Security Engineer",
    date: "2021 - 2024",
    description: "Securing TikTok E-Commerce products, performing S-SDLC and SAST research on other ByteDance products.",
    category: "cybersecurity",
    icon: "Lock",
    coy: "ByteDance/TikTok"
  },
  {
    id: 13,
    title: "Founder",
    date: "2021 - 2021",
    description: "Crafted bespoke bottled cocktails.",
    category: ["f&b", "entrepreneurship"],
    icon: "MoonStar",
    coy: "Moonshots"
  },
  {
    id: 41,
    title: "Security Consultant",
    date: "2020 - 2021",
    description: "Conducted VAPT services and security reviews for clients across various industries.",
    category: "cybersecurity",
    icon: "Swords",
    coy: "ITSEC Asia Pte Ltd"
  },
  {
    id: 61,
    title: "Security Engineer",
    date: "2019 - 2020",
    description: "Performed VAPT and compliance checks for military systems. Hardened critical infrastructure.",
    category: "cybersecurity",
    icon: "Shield",
    coy: "Defense Science and Technology Agency"
  },
  {
    id: 38,
    title: "Bartender",
    date: "2019 - 2019",
    description: "Performed bar back duties, mixing drinks and stock taking.",
    category: "f&b",
    icon: "Martini",
    coy: "La Maison Du Whisky Singapore"
  },
  {
    id: 27,
    title: "Red Team Intern",
    date: "2018 - 2019",
    description: "NFC card cloning research and Machine Learning for Cybersecurity.",
    category: "cybersecurity",
    icon: "BugPlay",
    coy: "Government Technology Agency of Singapore"
  },
  {
    id: 63,
    title: "Penetration Tester Intern",
    date: "2018 - 2018",
    description: "Cleaned Data for automated analysis of attacks, and analysed malware samples on clients.",
    category: "cybersecurity",
    icon: "Sword",
    coy: "InsiderSecurity"
  },
  {
    id: 41,
    title: "Team Lead",
    date: "2018 - 2023",
    description: "Led team 0x1EA7BEEF to top 15% rankings in local CTF competitions.",
    category: ["cybersecurity", "teaching"],
    icon: "Trophy",
    coy: "0x1EA7BEEF"
  },
  {
    id: 39,
    title: "Co-Founder",
    date: "2017 - 2017",
    description: "Created a startup and got first funding round to build the application.",
    category: "entrepreneurship",
    icon: "Trophy",
    coy: "JAYEO"
  },
  {
    id: 59,
    title: "Fullstack Software Engineer Intern",
    date: "2017 - 2017",
    description: "Built web interfaces using React/Redux and Laravel for ShopBack's internal platforms.",
    category: "cybersecurity",
    icon: "Code",
    coy: "Shopback Singapore"
  },
  {
    id: 71,
    title: "Assistant Teacher",
    date: "2017 - 2017",
    description: "Taught courses teaching microbits and ethical hacking to secondary school students in various schools.",
    category: ["cybersecurity", "teaching"],
    icon: "Bot",
    coy: "TinkerTanker"
  },
  {
    id: 44,
    title: "Teaching Assistant",
    date: "2016 - 2019",
    description: "Taught basic programming, algorithms and data structure modules to university students.",
    category: "teaching",
    icon: "University",
    coy: "National University of Singapore"
  },
  {
    id: 80,
    title: "Relief Allied Educator",
    date: "2015 - 2015",
    description: "Taught chemistry, marked class tests, conducted lessons and practical laboratory sessions.",
    category: "teaching",
    icon: "School",
    coy: "Ministry of Education, Singapore"
  }
];
