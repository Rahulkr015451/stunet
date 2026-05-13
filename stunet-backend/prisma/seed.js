const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const skills = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#",
  "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift",

  // Frontend
  "HTML", "CSS", "React", "Next.js", "Vue.js", "Angular",
  "Tailwind CSS", "Bootstrap",

  // Backend
  "Node.js", "Express", "NestJS", "Django", "Flask",
  "Spring Boot", "ASP.NET",

  // Databases
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite",

  // DevOps / Cloud
  "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "CI/CD", "Nginx",

  // Data / AI
  "Machine Learning", "Deep Learning", "Data Science",
  "Pandas", "NumPy", "TensorFlow", "PyTorch",

  // Tools
  "Git", "GitHub", "Linux", "Postman", "Figma",
  "Jira",

  // CS Fundamentals
  "DSA", "OOP", "System Design", "DBMS", "Operating Systems",
  "Computer Networks",
];

async function main() {
  for (const name of skills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Skills seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
