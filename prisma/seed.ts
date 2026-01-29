import { prisma } from "../src/lib/prisma";

async function main() {
  const categories = ["Math", "Physics", "English", "Hindi", "Chemistry", "Biology"];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },   // match by exact name
      update: {},
      create: { name },
    });
  }

  console.log("✅ Categories seeded successfully");
}

main()
  .catch(e => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
