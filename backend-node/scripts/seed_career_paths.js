const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CareerPath = require('./models/CareerPath');

dotenv.config();

const paths = [
  {
    title: "Web Development",
    description: "Build modern, responsive websites and full-stack applications.",
    programmingLanguages: ["HTML", "CSS", "JavaScript", "TypeScript"],
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    miniProjects: [
      { title: "SaaS Dashboard", description: "Design a high-fidelity admin panel", techStack: ["React", "Tailwind"] },
      { title: "Real-time Chat", description: "Socket-based communication app", techStack: ["Node.js", "Socket.io"] }
    ]
  },
  {
    title: "Data Science",
    description: "Analyze large datasets and build predictive models.",
    programmingLanguages: ["Python", "SQL", "R"],
    tools: ["Pandas", "NumPy", "Scikit-Learn", "Tableau", "PowerBI"],
    miniProjects: [
      { title: "Stock Predictor", description: "Time-series forecasting model", techStack: ["Python", "LSTM"] }
    ]
  },
  {
    title: "AI/ML Engineer",
    description: "Design and implement intelligent algorithms and neural networks.",
    programmingLanguages: ["Python", "C++", "Julia"],
    tools: ["PyTorch", "TensorFlow", "Keras", "OpenCV"],
    miniProjects: [
      { title: "Face Recognition", description: "Real-time biometric system", techStack: ["OpenCV", "Python"] }
    ]
  },
  {
      title: "Cybersecurity",
      description: "Protect systems and networks from digital attacks.",
      programmingLanguages: ["Python", "Bash", "Go"],
      tools: ["Wireshark", "Metasploit", "Nmap", "Kali Linux"],
      miniProjects: [
          { title: "Network Scanner", description: "Custom port scanning tool", techStack: ["Python", "Scapy"] }
      ]
  },
  {
      title: "App Development",
      description: "Create native and cross-platform mobile experiences.",
      programmingLanguages: ["Swift", "Kotlin", "Dart"],
      tools: ["Flutter", "React Native", "Android Studio", "Xcode"],
      miniProjects: [
          { title: "Fitness Tracker", description: "Mobile health monitoring app", techStack: ["Flutter", "Firebase"] }
      ]
  },
  {
      title: "Cloud Engineer",
      description: "Manage scalable infrastructure and cloud services.",
      programmingLanguages: ["Python", "YAML", "Terraform"],
      tools: ["AWS", "Azure", "Docker", "Kubernetes"],
      miniProjects: [
          { title: "Auto-scalable Cluster", description: "Cloud-native deployment", techStack: ["Terraform", "AWS"] }
      ]
  },
  {
      title: "SAP Consultant",
      description: "Implement and optimize enterprise management systems.",
      programmingLanguages: ["ABAP", "Java"],
      tools: ["SAP S/4HANA", "Fiori", "HANA Studio"],
      miniProjects: [
          { title: "Inventory Optimizer", description: "ERP workflow automation", techStack: ["ABAP"] }
      ]
  }
];

const seedCareerPaths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await CareerPath.deleteMany();
    await CareerPath.insertMany(paths);
    console.log("Career Paths Seeded Successfully! ✅");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedCareerPaths();
