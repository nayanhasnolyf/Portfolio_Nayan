export const profile = {
  name: 'Nayan Pokhriyal',
  role: 'Full-Stack Developer & AI Systems Builder',
  location: 'Bangalore, India',
  email: 'nayanpokhriyal25@gmail.com',
  availability: 'Open to software engineering opportunities',
  linkedin: 'https://linkedin.com/in/nayan-pokhriyal-7a1756323',
  github: 'https://github.com/nayanhasnolyf',
};

export const navigation = ['Work', 'System', 'Approach', 'Contact'];

export const metrics = [
  { value: '15', label: 'Reviewed projects' },
  { value: '6', label: 'Portfolio-grade' },
  { value: '1', label: 'Live product' },
];

export const story = {
  eyebrow: 'Personal trajectory',
  title: 'I build calm software systems at the edge of product, AI, and engineering depth.',
  intro:
    'I am Nayan Pokhriyal, a full-stack developer and AI systems builder studying Electronics Engineering with a VLSI Design & Technology focus at Bangalore Institute of Technology. My work sits in a slightly unusual place: I like polished product interfaces, but I also care about the systems underneath them, from APIs and databases to agent workflows, deployment, and even hardware-oriented thinking.',
  body: [
    'The thread across my projects is simple: I enjoy turning broad, messy ideas into working software that feels understandable. A financial dashboard becomes more than charts when it has authentication, role-aware workflows, transaction CRUD, analytics, internationalization, and an assistant that can help users reason about money. An AI project becomes more than a wrapper when it has agents, tools, memory, backend structure, and a clear job to perform. A hardware project becomes more than an assignment when the RTL is reusable, testable, and connected to a real accelerator architecture.',
    'I have been intentionally building across layers because I want to become the kind of engineer who can see the full shape of a product. On the frontend, I work with React, Vite, Tailwind, state management, responsive layouts, and careful interaction design. On the backend, I work with Node.js, Express, Spring Boot, REST APIs, PostgreSQL, SQLAlchemy, JPA, and deployment workflows. In AI, I have explored Gemini, CrewAI, agentic systems, MCP concepts, ChromaDB, and applied workflows where models are part of a larger system instead of the whole system.',
    'Outside pure code, leadership has shaped how I work. NCC training and event experience with the Under 25 Summit taught me how to coordinate with people, sell an idea, take responsibility under pressure, and keep moving when things are imperfect. That matters in engineering too: good software is not just clever implementation, it is communication, prioritization, taste, and the ability to make a system easier for the next person to understand.',
  ],
  currentFocus:
    'Right now I am focused on building portfolio-grade full-stack and AI products: clean interfaces, reliable backend structure, thoughtful data flows, and systems that feel calm to use. I am especially interested in roles where I can contribute to product engineering, applied AI tools, backend services, and developer-facing systems.',
  highlights: [
    'Full-stack product engineering with React, Tailwind, Node.js, Express, Spring Boot, and PostgreSQL.',
    'Applied AI systems using Gemini, CrewAI, agent workflows, vector search concepts, and tool-oriented architecture.',
    'Engineering fundamentals from DSA, OOP, DBMS, software engineering, Linux, debugging, and VLSI-oriented hardware work.',
  ],
};

export const projects = [
  {
    rank: 1,
    score: 'A+',
    title: 'Spndx',
    category: 'Full-Stack Financial Dashboard',
    description:
      'The strongest portfolio project: a deployed full-stack financial dashboard with role-based controls, transaction CRUD, analytics, Recharts visualisations, 11-language support, and a Gemini-powered financial assistant.',
    details: ['React/Vite', 'Express', 'PostgreSQL', 'Gemini API'],
    repoUrl: 'https://github.com/nayanhasnolyf/Spndx---financial-dashboard-workspace',
    liveUrl: 'https://spndx-financial-dashboard-workspace.vercel.app',
    status: 'Featured',
  },
  {
    rank: 2,
    score: 'A',
    title: 'MolGenix',
    category: 'AI Drug Discovery Backend',
    description:
      'A high-value collaboration project: an AI-powered drug discovery backend where researchers describe a disease target and the system scaffolds molecule generation, screening, ADMET prediction, docking, vector search, and report generation.',
    details: ['FastAPI', 'PostgreSQL', 'RDKit', 'DeepChem'],
    repoUrl: 'https://github.com/Yash07-pixel/molgenix',
    status: 'Featured collaboration',
  },
  {
    rank: 3,
    score: 'A',
    title: 'RISC-V Systolic Array Accelerator',
    category: 'Hardware / Verilog Accelerator',
    description:
      'A high-signal engineering project: a 4x4 output-stationary systolic array accelerator in synthesizable Verilog with reusable RTL blocks, MMIO bridge, testbenches, and waveform verification.',
    details: ['Verilog', 'RISC-V', 'MMIO', 'Iverilog'],
    repoUrl: 'https://github.com/nayanhasnolyf/RISC-V-Systolic-Array-Accelerator',
    status: 'Featured',
  },
  {
    rank: 4,
    score: 'A-',
    title: 'Multi-Agent Legal Mediation AI',
    category: 'TypeScript AI Product Prototype',
    description:
      'A focused TypeScript/Vite application with component, context, service, and type layers for a multi-agent legal mediation experience. Strong product direction, but would benefit from a README.',
    details: ['TypeScript', 'Vite', 'React', 'AI UX'],
    repoUrl: 'https://github.com/nayanhasnolyf/multi-agent-legal-mediation-ai',
    status: 'Featured',
  },
  {
    rank: 5,
    score: 'B+',
    title: 'Research Crew',
    category: 'CrewAI Research Workflow',
    description:
      'A multi-agent research workflow using CrewAI with researcher and reporting analyst agents that collaborate to generate structured reports.',
    details: ['Python', 'CrewAI', 'Agents', 'Reports'],
    repoUrl: 'https://github.com/nayanhasnolyf/Reseach-Crew',
    status: 'Strong',
  },
  {
    rank: 6,
    score: 'B+',
    title: 'Multi-Agent Cold Email Generator Sender',
    category: 'Agentic Sales Automation',
    description:
      'A multi-agent orchestration system that generates, formats, and sends cold sales emails using Google Gemini API via an OpenAI-compatible client and SendGrid.',
    details: ['Python', 'Gemini API', 'SendGrid', 'Agents'],
    repoUrl: 'https://github.com/nayanhasnolyf/Multi-Agent-Cold-Email-Generator-Sender',
    status: 'Strong',
  },
  {
    rank: 7,
    score: 'B',
    title: 'Career Conversations Chatbox',
    category: 'AI Personal Assistant',
    description:
      'An AI-powered personal career assistant that answers questions about experience, notifies about new leads, and helps connect professionally with visitors.',
    details: ['Python', 'AI Assistant', 'Lead Alerts'],
    repoUrl: 'https://github.com/nayanhasnolyf/Career-Conversations-Chatbox',
    status: 'Promising',
  },
  {
    rank: 8,
    score: 'B-',
    title: 'Nayaai',
    category: 'CrewAI Agent Template',
    description:
      'A CrewAI-based multi-agent setup with configurable agents and tasks. Useful AI systems practice, though the README still reads close to the starter template.',
    details: ['Python', 'CrewAI', 'uv', 'Agents'],
    repoUrl: 'https://github.com/nayanhasnolyf/nayaai',
    status: 'Improve README',
  },
  {
    rank: 9,
    score: 'C+',
    title: 'Jojen AI',
    category: 'Gemini + Gradio Chat Assistant',
    description:
      'A custom AI chat assistant using Gemini Pro API and Gradio for a personalized interactive chat experience.',
    details: ['Python', 'Gemini Pro', 'Gradio'],
    repoUrl: 'https://github.com/nayanhasnolyf/Jojen-AI',
    status: 'Utility',
  },
  {
    rank: 10,
    score: 'C+',
    title: 'Gemini Chatbox',
    category: 'Terminal AI Utility',
    description:
      'A simple Python terminal script that connects to Google Gemini using the official Python SDK and returns AI-generated responses.',
    details: ['Python', 'Gemini SDK', 'CLI'],
    repoUrl: 'https://github.com/nayanhasnolyf/Gemini-Chatbox',
    status: 'Utility',
  },
  {
    rank: 11,
    score: 'C',
    title: 'TicTacToe Game Using Minimax AI',
    category: 'DSA / Java AI Exercise',
    description:
      'A console-based Java Tic Tac Toe game using the Minimax algorithm to create an unbeatable AI while practicing DSA concepts.',
    details: ['Java', 'Minimax', 'DSA'],
    repoUrl: 'https://github.com/nayanhasnolyf/TicTacToe-Game-Using-MINMAX-AI',
    status: 'Learning',
  },
  {
    rank: 12,
    score: 'C-',
    title: 'Sta',
    category: 'Unclear Repository',
    description:
      'A recent public repository with code present but no description or README signal from the GitHub API. Add a README before featuring.',
    details: ['Needs README', 'Needs Summary'],
    repoUrl: 'https://github.com/nayanhasnolyf/Sta',
    status: 'Needs docs',
  },
  {
    rank: 13,
    score: 'C-',
    title: 'JavaScript',
    category: 'JavaScript Practice',
    description:
      'A small JavaScript learning repository. Useful as practice history, but not portfolio-featured yet.',
    details: ['JavaScript', 'Practice'],
    repoUrl: 'https://github.com/nayanhasnolyf/JavaScript',
    status: 'Learning',
  },
  {
    rank: 14,
    score: 'D',
    title: 'Java-Script',
    category: 'JavaScript Practice',
    description:
      'A zero-size JavaScript learning repository from the public GitHub metadata. Keep as archive or merge with the main JavaScript practice repo.',
    details: ['Practice', 'Archive'],
    repoUrl: 'https://github.com/nayanhasnolyf/Java-Script',
    status: 'Archive',
  },
  {
    rank: 15,
    score: 'D',
    title: 'test',
    category: 'Test Repository',
    description:
      'A zero-size test repository. Best kept out of featured portfolio sections, but included here for complete ranking.',
    details: ['Test', 'Archive'],
    repoUrl: 'https://github.com/nayanhasnolyf/test',
    status: 'Archive',
  },
];

export const capabilities = [
  {
    title: 'Full-Stack Product Engineering',
    description:
      "From Vite+React frontends to Spring Boot APIs — I've shipped full products, not just components.",
  },
  {
    title: 'AI & Agentic Systems',
    description:
      'Multi-agent pipelines with CrewAI, MCP servers, and vector search. Built for workflows that actually run autonomously.',
  },
  {
    title: 'Databases & Infrastructure',
    description:
      'PostgreSQL to H2, Docker to Kubernetes, Render to Vercel. Systems that deploy and stay deployed.',
  },
];

export const principles = [
  'Data Structures & Algorithms',
  'Object-Oriented Programming',
  'DBMS and Software Engineering',
  'Microservices and Event-Driven Architecture',
  'API Integration',
  'Linux and Debugging',
];

export const education = {
  degree: 'B.E. - Electronics Engineering (VLSI Design & Technology)',
  institution: 'Bangalore Institute of Technology',
  location: 'Bangalore, Karnataka',
  period: '2023 - 2027',
};

export const certifications = [
  {
    title: 'JPMorgan Chase SWE Job Simulation',
    issuer: 'Forage',
    date: 'Feb 2026',
    description: 'Spring Boot microservices, Apache Kafka, JPA/H2, REST APIs, and Maven test suites.',
  },
  {
    title: 'AI Engineer Agentic Track: Agents & MCP',
    issuer: 'Udemy',
    date: 'Jan 2026',
    description: 'Multi-agent systems, Model Context Protocol, and agentic AI design.',
  },
  {
    title: 'Docker & Kubernetes Masterclass',
    issuer: 'Scaler',
    date: 'Sep 2024',
    description: 'Containerisation, orchestration, scaling, and production deployments.',
  },
];

export const leadership = [
  'NCC B-Certificate — trained in discipline, team coordination, and performing under pressure.',
  'Sales & marketing lead at Under 25 Summit, Bangalore — coordinated logistics for 550+ attendees.',
];
