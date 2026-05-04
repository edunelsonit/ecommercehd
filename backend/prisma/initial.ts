const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Seed Genders
  const male = await prisma.gender.upsert({
    where: { id: 1 },
    update: {},
    create: { sex: 'Male' },
  });

  const female = await prisma.gender.upsert({
    where: { id: 2 },
    update: {},
    create: { sex: 'Female' },
  });

  // 2. Seed Country
  const nigeria = await prisma.country.upsert({
    where: { name: 'Nigeria' },
    update: {},
    create: { name: 'Nigeria' },
  });

  // 3. Seed State (Linked to Nigeria)
  const taraba = await prisma.state.upsert({
    where: { id: 1 }, // Using ID for stability
    update: {},
    create: {
      name: 'Taraba',
      countryId: nigeria.id,
    },
  });

  // 4. Seed LGA (Linked to Taraba)
  await prisma.localGovernment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Sardauna',
      stateId: taraba.id,
    },
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });