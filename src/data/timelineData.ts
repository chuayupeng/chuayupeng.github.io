
export type CategoryType = "cybersecurity" | "teaching" | "f&b" | "entrepreneurship";

export type TimelineItemType = {
  coy: string;
  id: number;
  title: string;
  date: string;
  description: string;
  logo: string;
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
    icon: "Usb",
    coy: "Symmetry Investments",
    logo: "./coylogo/sym.ico",
  },
  {
    id: 55,
    title: "Computer Science Teacher",
    date: "2024 - Present",
    description: "Taught Computer Science for Cambridge AS and A Levels Examinations.",
    category: "teaching",
    icon: "BookOpen",
    coy: "Furen International School",
    logo: "./coylogo/furen.jpg"
  },
  {
    id: 9,
    title: "Co-Founder",
    date: "2024 - 2024",
    description: "Created original recipes and helped open a stall at Marketplace@Expo.",
    category: ["f&b", "entrepreneurship"],
    icon: "IceCreamBowl",
    coy: "WhiteHatOne Pte Ltd",
    logo: "./coylogo/cbs.svg"
  },
  {
    id: 49,
    title: "CSIRT Member",
    date: "2023 - Present",
    description: "Conducted incident response, malware analysis, and forensic investigations under military service.",
    category: "cybersecurity",
    icon: "Radar",
    coy: "Digital Intelligence Services",
    logo: "./coylogo/dis.png"
  },
  {
    id: 51,
    title: "Red Team Member",
    date: "2023 - 2024",
    description: "Freelance penetration testing services.",
    category: "cybersecurity",
    icon: "Swords",
    coy: "Synack Red Team",
    logo: "./coylogo/srt.png"
  },
  {
    id: 52,
    title: "Cybersecurity Advisor",
    date: "2022 - 2023",
    description: "Advised stealth gaming startup on security integration and best practices.",
    category: ["entrepreneurship", "cybersecurity"],
    icon: "BookOpen",
    coy: "_______________________",
    logo: "./coylogo/cres.png"
  },
  {
    id: 35,
    title: "Product Security Engineer",
    date: "2021 - 2024",
    description: "Securing TikTok E-Commerce products, performing S-SDLC and SAST research on other ByteDance products.",
    category: "cybersecurity",
    icon: "Lock",
    coy: "ByteDance",
    logo: "./coylogo/bd.jpg"
  },
  {
    id: 13,
    title: "Founder",
    date: "2021 - 2021",
    description: "Crafted bespoke bottled cocktails.",
    category: ["f&b", "entrepreneurship"],
    icon: "MoonStar",
    coy: "Moonshots",
    logo: "./coylogo/moonshots.png"
  },
  {
    id: 43,
    title: "Security Consultant",
    date: "2020 - 2021",
    description: "Conducted VAPT services and security reviews for clients across various industries.",
    category: "cybersecurity",
    icon: "Swords",
    coy: "ITSEC Asia Pte Ltd",
    logo: "./coylogo/itsec.png"
  },
  {
    id: 61,
    title: "Security Engineer",
    date: "2019 - 2020",
    description: "Performed VAPT and compliance checks for military systems. Hardened critical infrastructure.",
    category: "cybersecurity",
    icon: "Shield",
    coy: "Defense Science and Technology Agency",
    logo: "./coylogo/dsta.png"
  },
  {
    id: 38,
    title: "Bartender",
    date: "2019 - 2019",
    description: "Performed bar back duties, mixing drinks and stock taking.",
    category: "f&b",
    icon: "Martini",
    coy: "La Maison Du Whisky Singapore",
    logo: "./coylogo/lmdw.png"
  },
  {
    id: 27,
    title: "Red Team Intern",
    date: "2018 - 2019",
    description: "NFC card cloning research and Machine Learning for Cybersecurity.",
    category: "cybersecurity",
    icon: "BugPlay",
    coy: "Government Technology Agency of Singapore",
    logo: "./coylogo/govtech.png"
  },
  {
    id: 63,
    title: "Penetration Tester Intern",
    date: "2018 - 2018",
    description: "Cleaned Data for automated analysis of attacks, and analysed malware samples on clients.",
    category: "cybersecurity",
    icon: "Sword",
    coy: "InsiderSecurity",
    logo: "./coylogo/is.png"
  },
  {
    id: 41,
    title: "Team Lead",
    date: "2018 - 2023",
    description: "Led team 0x1EA7BEEF to top 15% rankings in local CTF competitions.",
    category: ["cybersecurity", "teaching"],
    icon: "Trophy",
    coy: "0x1EA7BEEF",
    logo: "./coylogo/beef.jpg"
  },
  {
    id: 39,
    title: "Co-Founder",
    date: "2017 - 2017",
    description: "Created a startup and got first funding round to build the application.",
    category: "entrepreneurship",
    icon: "Banana",
    coy: "JAYEO",
    logo: "./coylogo/jayeo.png"
  },
  {
    id: 59,
    title: "Fullstack Software Engineer Intern",
    date: "2017 - 2017",
    description: "Built web interfaces using React/Redux and Laravel for ShopBack's internal platforms.",
    category: "cybersecurity",
    icon: "Code",
    coy: "Shopback Singapore",
    logo: "./coylogo/shopback.png"
  },
  {
    id: 73,
    title: "Assistant Teacher",
    date: "2017 - 2017",
    description: "Taught courses teaching microbits and ethical hacking to secondary school students in various schools.",
    category: ["cybersecurity", "teaching"],
    icon: "Bot",
    coy: "TinkerTanker",
    logo: "./coylogo/tinkertanker.jpeg"
  },
  {
    id: 44,
    title: "Teaching Assistant",
    date: "2016 - 2019",
    description: "Taught basic programming, algorithms and data structure modules to university students.",
    category: "teaching",
    icon: "University",
    coy: "National University of Singapore",
    logo: "./coylogo/nus.png"
  },
  {
    id: 84,
    title: "Relief Allied Educator",
    date: "2015 - 2015",
    description: "Taught chemistry, marked class tests, conducted lessons and practical laboratory sessions.",
    category: "teaching",
    icon: "School",
    coy: "Ministry of Education, Singapore",
    logo: "./coylogo/moe.jpg"
  }
];
