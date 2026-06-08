export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  githubLink?: string;
  demoLink?: string;
  category: "AI & ML" | "Full Stack" | "DevOps & Hardware";
  architecture?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    ai_ml?: string[];
    hardware?: string[];
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  points: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  details: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const portfolioData = {
  name: "Sadnan Nafis",
  title: "Full Stack AI Engineer",
  email: "sadnan.ornob@gmail.com",
  phone: "+8801822442896",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/SNaf1",
  linkedin: "https://www.linkedin.com/in/sadnan-nafis/",
  blog: "https://gameriv.com/author/snaf",
  resumePath: "/Sadnan_Nafis_CV.pdf",
  profileSummary: "Software Engineer with hands-on experience building and deploying LLM-powered systems, including Retrieval-Augmented Generation (RAG) pipelines for legal document analysis. Strong background in backend engineering, ML-driven applications, and research-oriented problem solving, with demonstrated ownership of end-to-end systems from prototyping to production.",

  projects: [
    {
      id: "echosort",
      title: "EchoSort (AI Ticketing System)",
      shortDescription: "Full-stack AI-powered ticketing and feedback classification system.",
      fullDescription: "Built a full-stack AI-powered feedback management system. EchoSort classifies user feedback tickets using fine-tuned LLMs, assigns them to respective pipelines, triggers notification workflows, and showcases dashboard analytics for managing and routing user complaints.",
      tags: ["Next.js", "Prisma", "MongoDB", "Tailwind CSS", "Zod", "LLM Integration"],
      demoLink: "https://echo-sort-beta.vercel.app/",
      githubLink: "https://github.com/SNaf1/EchoSort",
      category: "Full Stack",
      architecture: {
        frontend: ["Next.js 14 (App Router)", "Tailwind CSS", "shadcn/ui", "React Hook Form"],
        backend: ["Next.js Server Actions", "Node.js", "Zod Validation"],
        database: ["MongoDB", "Prisma ORM"],
        ai_ml: ["Hugging Face API", "OpenAI GPT-4 Integration", "LangChain"]
      }
    },
    {
      id: "football-var",
      title: "Football VAR Simulation",
      shortDescription: "Computer vision based video assistant referee simulation.",
      fullDescription: "Developed a computer vision prototype simulating VAR (Video Assistant Referee) officiating. Uses frame-by-frame video parsing, bounding box collision detection, and line projection to determine offside positions and goal-line crossings.",
      tags: ["Python", "OpenCV", "Matplotlib", "Computer Vision"],
      demoLink: "https://football-var.vercel.app/",
      githubLink: "https://github.com/SNaf1/Football-VAR",
      category: "AI & ML",
      architecture: {
        frontend: ["React.js", "Tailwind CSS (Web UI)"],
        backend: ["FastAPI", "Python"],
        ai_ml: ["OpenCV (Computer Vision)", "NumPy", "Matplotlib", "YOLO Object Detection"]
      }
    },
    {
      id: "astra",
      title: "ASTRA",
      shortDescription: "Automated Software Test Repair and Analysis framework using self-healing LLM loops.",
      fullDescription: "Designed and implemented an LLM-based framework to automatically generate and repair Python unit tests. Features a self-healing repair loop driven by execution feedback, compiler output, and error tracebacks. Significantly improves test suite coverage and fixes broken tests autonomously without developer intervention.",
      tags: ["Python", "LLM", "AST Parsing", "Self-Healing", "Software Testing"],
      githubLink: "https://github.com/SNaf1/ASTRA",
      category: "AI & ML",
      architecture: {
        backend: ["Python CLI", "AST (Abstract Syntax Tree) Parser"],
        ai_ml: ["Code Reasoning LLMs", "Self-healing Loops", "Execution Traceback Parsers"],
        database: ["Local Log Store"]
      }
    },
    {
      id: "bilingual-rag",
      title: "Bilingual RAG System",
      shortDescription: "A Retrieval-Augmented Generation system for querying Bengali literature.",
      fullDescription: "Built a bilingual Retrieval-Augmented Generation (RAG) system to answer complex queries about Bengali literature. Implemented semantic indexing, vector embeddings, and cross-lingual retrieval, enabling accurate retrieval and context-aware generation across English and Bengali sources.",
      tags: ["Python", "FastAPI", "LangChain", "Vector DB", "RAG", "LLM"],
      githubLink: "https://github.com/SNaf1/Bilingual-RAG",
      category: "AI & ML",
      architecture: {
        backend: ["FastAPI", "Python"],
        database: ["Pinecone / Chroma Vector Database"],
        ai_ml: ["LangChain", "OpenAI Embeddings", "Cross-lingual Retrievers", "LlamaIndex"]
      }
    },
    {
      id: "smart-vault",
      title: "Arduino Smart Vault",
      shortDescription: "Secure smart locker system featuring keypad authentication and active alarms.",
      fullDescription: "Engineered an Arduino-based smart vault locker system for physical asset security. Integrates matrix keypad authentication, visual LCD state displays, servo motor locking mechanisms, and a buzzer alarm module that triggers upon repeated invalid attempts.",
      tags: ["Arduino", "C++", "Keypad", "Buzzer Alarm", "Embedded Systems"],
      githubLink: "https://github.com/SNaf1/Arduino-Smart-Vault",
      category: "DevOps & Hardware",
      architecture: {
        hardware: ["Arduino Uno", "4x4 Matrix Keypad", "16x2 I2C LCD Display", "Servo Motor SG90", "Buzzer Module"],
        backend: ["C++ Arduino sketch"]
      }
    },
    {
      id: "healthcare",
      title: "Healthcare Management System",
      shortDescription: "Centralized healthcare dashboard managing patient schedules and clinic bookings.",
      fullDescription: "Developed a comprehensive healthcare platform to streamline clinical workflows. Enables secure patient onboarding, digital prescription logging, doctor schedule configurations, and real-time appointment bookings.",
      tags: ["Java", "Spring Boot", "MySQL", "Hibernate", "Bootstrap"],
      githubLink: "https://github.com/SNaf1/healthcare_management",
      category: "Full Stack",
      architecture: {
        frontend: ["HTML5", "CSS3", "Bootstrap", "Thymeleaf Templates"],
        backend: ["Java", "Spring Boot", "Spring Security"],
        database: ["MySQL", "Hibernate ORM"]
      }
    },
    {
      id: "auction-house",
      title: "Auction House",
      shortDescription: "Real estate e-auction platform with ML-driven price predictions.",
      fullDescription: "Engineered a data-driven real estate e-auction website where users can list and bid on properties. Integrates a machine learning regression model trained on historical sales datasets to predict property market values and guide users on fair bidding.",
      tags: ["Python", "Django", "JavaScript", "Scikit-Learn", "Machine Learning"],
      githubLink: "https://github.com/SNaf1/Auction-House",
      category: "Full Stack",
      architecture: {
        frontend: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
        backend: ["Python", "Django Framework"],
        database: ["SQLite / PostgreSQL"],
        ai_ml: ["Scikit-Learn Regression Models", "Pandas Data Processing", "NumPy"]
      }
    },
    {
      id: "braccit",
      title: "braccit (University Student Hub)",
      shortDescription: "Comprehensive MERN-stack student portal for resource sharing.",
      fullDescription: "Engineered a comprehensive MERN-stack application designed to centralize academic and social resources for university students. Features secure JWT authentication, a RESTful API, dynamic resource posting, peer ratings, and real-time discussion forums.",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST API"],
      githubLink: "https://github.com/SNaf1/braccit",
      category: "Full Stack",
      architecture: {
        frontend: ["React.js", "Tailwind CSS", "Redux Toolkit"],
        backend: ["Node.js", "Express.js", "JWT (JSON Web Tokens)"],
        database: ["MongoDB", "Mongoose ODM"]
      }
    }
  ] as Project[],

  experience: [
    {
      id: "remoteintegrity",
      role: "Full Stack AI Developer",
      company: "RemoteIntegrity LLC",
      location: "Florida, USA (Fully Remote)",
      duration: "May 2026 – Present",
      points: [
        "Develop and maintain full-stack web and mobile applications using React.js, React Native, Node.js, Express.js, and MongoDB.",
        "Architect and integrate AI-driven features, including Retrieval-Augmented Generation (RAG), conversational agents, and LLM-powered automation workflows.",
        "Design scalable backend services and APIs connecting user-facing applications with databases, external platforms, and AI infrastructure."
      ]
    },
    {
      id: "privacce",
      role: "AI Implementation Engineer",
      company: "PrivacceLabs LLC",
      location: "Wyoming, USA (Dhaka Office)",
      duration: "October 2025 – April 2026",
      points: [
        "Led end-to-end development of a production-grade legal RAG system, translating high-level product requirements into deployable backend services, using Python and FastAPI.",
        "Implemented document ingestion, embedding, retrieval, and LLM-based response pipelines supporting structured legal queries.",
        "Conducted systematic testing, evaluation, and iterative refinement of retrieval and generation components, increasing usable response accuracy from approximately 45% to over 90%.",
        "Prototyped and iterated frontend interfaces using AI-assisted development to validate AI workflows and ensure smooth integration with backend services."
      ]
    },
    {
      id: "ta",
      role: "Teaching Assistant",
      company: "BRAC University",
      location: "Dhaka, Bangladesh",
      duration: "June 2024 – June 2025",
      points: [
        "Conducted weekly 12-hour consultation sessions and supported 3-hour lab sessions for a class of 35 students in Object-Oriented Programming (Java) and Electronics Circuit courses.",
        "Graded programming assignments, evaluated student performance, and provided individualized academic support.",
        "Assisted faculty members with viva assessments and the administration of final laboratory examinations."
      ]
    },
    {
      id: "esports",
      role: "Senior Esports Writer",
      company: "Gameriv",
      location: "Dhaka, Bangladesh",
      duration: "Jan 2020 – Sept 2025",
      points: [
        "Coordinated content planning and task distribution among multiple writers, ensuring timely delivery and editorial quality.",
        "Worked with editors and platform requirements to align technical gaming content with audience engagement goals.",
        "Analyzed readership trends to guide article topics, contributing to consistent traffic growth (author profile: gameriv.com/author/snaf)."
      ]
    }
  ] as Experience[],

  education: [
    {
      id: "bracu",
      degree: "Bachelor of Science in Computer Science and Engineering",
      institution: "BRAC University",
      duration: "Sept 2021 – Oct 2025",
      details: "CGPA: 3.96/4.0. Completed with deep focus on algorithms, software engineering, and machine learning models."
    },
    {
      id: "alevels",
      degree: "A'Levels",
      institution: "Earth House Alternative School, Dhaka",
      duration: "Completed 2020",
      details: "Result: 1A* and 2A."
    },
    {
      id: "olevels",
      degree: "O'Levels",
      institution: "Happy Times International School, Dhaka",
      duration: "Completed 2018",
      details: "Result: 5A*, 2As, and 1B."
    }
  ] as Education[],

  skills: [
    {
      category: "Programming Languages",
      items: ["Python", "TypeScript", "JavaScript", "C++", "C", "Java", "SQL"]
    },
    {
      category: "Web Development",
      items: ["React.js", "Next.js", "Node.js", "Express.js", "FastAPI", "Django", "Tailwind CSS", "MongoDB", "PostgreSQL", "Prisma"]
    },
    {
      category: "AI & ML Libraries",
      items: ["PyTorch", "LangChain", "RAG Pipelines", "Pandas", "NumPy", "Matplotlib", "Scikit-Learn"]
    },
    {
      category: "DevOps & Tools",
      items: ["Docker", "Git", "GitHub Actions", "Nginx", "Linux", "WSL2", "REST APIs", "Unreal Engine"]
    }
  ] as SkillCategory[],

  achievements: [
    {
      id: "scholarship",
      title: "Merit-Based Scholarship",
      description: "Received a 75% tuition fee waiver at BRAC University based on outstanding academic merit."
    },
    {
      id: "vclist",
      title: "Vice Chancellor's List",
      description: "Placed on the Vice Chancellor's List for 10 semesters in recognition of maintaining a CGPA between 3.90 and 4.00."
    },
    {
      id: "staraward",
      title: "The Daily Star Award",
      description: "Honored by The Daily Star for exceptional academic performance in O-Level international examinations."
    }
  ] as Achievement[],

  scores: {
    title: "IELTS Academic Score",
    overall: "8.0",
    details: "Listening: 9.0 | Reading: 9.0 | Writing: 7.0 | Speaking: 7.0"
  }
};
