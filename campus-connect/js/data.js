/* ============================================================
   data.js — Campus Connect Data
   ============================================================ */

const CampusData = {

  events: [
    {
      id: 1,
      title: "Intramurals Sports Festival",
      desc: "Annual Sports Competition featuring Basketball, Volleyball, and E-Sports events.",
      date: "Monday, February 9, 2026",
      time: "8am – 6pm",
      venue: "Crowned Jewel",
      type: "activity",
      featured: true
    },
    {
      id: 2,
      title: "Battle of the Bands",
      desc: "Open to aspiring musicians from the Junior High School, Senior High School, and College Departments. Each band may have 6 members.",
      date: "Monday, February 9, 2026",
      time: "5pm",
      venue: "Crowned Jewel",
      type: "activity",
      featured: false
    },
    {
      id: 3,
      title: "ITS Exhibitors",
      desc: "BSIT Students must showcase their System, Figma, and Capstone Projects.",
      date: "Wednesday, February 11, 2026",
      time: "9am – 4pm",
      venue: "Veranda",
      type: "academic",
      featured: false
    }
  ],

  programs: [
    {
      id: 1,
      abbr: "BSIT",
      name: "Bachelor of Science in Information Technology",
      logo: "images/programs/bsit.png",
      description: "The BSIT program equips students with the technical knowledge and practical skills needed in the field of Information Technology. It covers software development, networking, database management, and emerging technologies to prepare graduates for careers in the IT industry.",
      duration: "4 Years",
      units: "170 Units",
      department: "College of Computer Studies",
      head: "Ms. Almeda Asuncion",
      highlights: [
        "Software Development & Web Technologies",
        "Network Administration & Security",
        "Database Management Systems",
        "Capstone & System Development Projects",
        "Figma & UI/UX Design"
      ],
      careers: [
        "Software Developer",
        "Network Engineer",
        "Database Administrator",
        "IT Support Specialist",
        "Systems Analyst"
      ]
    },
    {
      id: 2,
      abbr: "BSBA",
      name: "Bachelor of Science in Business Administration",
      logo: "images/programs/bsba.png",
      description: "The BSBA program provides students with a strong foundation in business principles including management, marketing, finance, and operations. Graduates are prepared to lead and manage organizations in a dynamic and competitive business environment.",
      duration: "4 Years",
      units: "162 Units",
      department: "College of Business and Management",
      head: "Mr. Ronald Poblete",
      highlights: [
        "Business Management & Leadership",
        "Marketing Strategies",
        "Financial Management",
        "Human Resource Management",
        "Business Ethics & Corporate Governance"
      ],
      careers: [
        "Business Manager",
        "Marketing Officer",
        "Operations Supervisor",
        "HR Specialist",
        "Entrepreneur"
      ]
    },
    {
      id: 3,
      abbr: "BSA",
      name: "Bachelor of Science in Accountancy",
      logo: "images/programs/bsa.png",
      description: "The BSA program is designed to produce competent accountants equipped with knowledge in financial reporting, auditing, taxation, and management advisory services. It prepares students for the CPA Licensure Examination and professional practice.",
      duration: "4 Years",
      units: "186 Units",
      department: "College of Accountancy",
      head: "Mr. Renz Carlo Magtibay",
      highlights: [
        "Financial Accounting & Reporting",
        "Auditing Theory & Practice",
        "Taxation & Business Laws",
        "Management Advisory Services",
        "CPA Board Exam Review"
      ],
      careers: [
        "Certified Public Accountant",
        "External / Internal Auditor",
        "Tax Consultant",
        "Financial Analyst",
        "Accounting Supervisor"
      ]
    },
    {
      id: 4,
      abbr: "BSE",
      name: "Bachelor of Science in Entrepreneurship",
      logo: "images/programs/bse.png",
      description: "The BSE program nurtures the entrepreneurial mindset and equips students with skills in starting, managing, and growing a business. Students learn innovation, business planning, financial management, and marketing to become successful entrepreneurs.",
      duration: "4 Years",
      units: "160 Units",
      department: "College of Business and Management",
      head: "Ms. Jennifer Charanguero",
      highlights: [
        "Business Planning & Feasibility Studies",
        "Innovation & Creative Thinking",
        "Social Entrepreneurship",
        "Small Business Management",
        "Product Development & Branding"
      ],
      careers: [
        "Business Owner / Entrepreneur",
        "Business Development Officer",
        "Product Manager",
        "Social Enterprise Manager",
        "Startup Founder"
      ]
    },
    {
      id: 5,
      abbr: "BSP",
      name: "Bachelor of Science in Psychology",
      logo: "images/programs/bsp.png",
      description: "The BSP program provides a comprehensive understanding of human behavior, mental processes, and psychological theories. It prepares students for careers in counseling, human resources, research, and various fields that require an understanding of the human mind.",
      duration: "4 Years",
      units: "158 Units",
      department: "College of Arts and Sciences",
      head: "Mr. Ralph Balin",
      highlights: [
        "Psychological Theories & Research",
        "Counseling & Psychotherapy",
        "Industrial & Organizational Psychology",
        "Developmental & Abnormal Psychology",
        "Psychological Testing & Assessment"
      ],
      careers: [
        "Psychologist / Counselor",
        "HR Officer / Recruiter",
        "Research Analyst",
        "Guidance Counselor",
        "Social Worker"
      ]
    }
  ],

  contacts: [
    {
      id: 1,
      name: "Ms. Almeda Asuncion",
      dept: "BSIT – Information Technology",
      role: "Program Head",
      email: "almeda@gmail.com",
      phone: "09924578392",
      room: "Room 401"
    },
    {
      id: 2,
      name: "Mr. Ronald Poblete",
      dept: "BSBA – Business Administration",
      role: "Program Head",
      email: "ronaldpoblete@gmail.com",
      phone: "09924659378",
      room: "Room 214"
    },
    {
      id: 3,
      name: "Mr. Renz Carlo Magtibay",
      dept: "BSA – Accountancy",
      role: "Program Head",
      email: "carlorenz@gmail.com",
      phone: "09846738592",
      room: "Room 57"
    },
    {
      id: 4,
      name: "Mr. Ralph Balin",
      dept: "BSP – Psychology",
      role: "Program Head",
      email: "ralphbalin@gmail.com",
      phone: "09874978392",
      room: "Room 62"
    },
    {
      id: 5,
      name: "Ms. Jennifer Charanguero",
      dept: "BSE – Entrepreneur",
      role: "Program Head",
      email: "jencharang@gmail.com",
      phone: "09722738392",
      room: "Room 55"
    }
  ]

};
