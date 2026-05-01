import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
    },
  });

  const apparel = await prisma.category.upsert({
    where: { slug: 'apparel' },
    update: {},
    create: {
      name: 'Apparel',
      slug: 'apparel',
    },
  });

  const kitchen = await prisma.category.upsert({
    where: { slug: 'kitchen' },
    update: {},
    create: {
      name: 'Kitchen & Dining',
      slug: 'kitchen',
    },
  });

  // 2. Create Products
  // Note: I'm assuming a Vendor with ID 1 exists.
  await prisma.product.createMany({
    data: [
      {
        vendorId: 1,
        categoryId: kitchen.id,
        name: "2-Slot Toaster - Black Chrome",
        description: "A sleek, high-performance toaster with variable browning control.",
        image: "images/products/black-2-slot-toaster.jpg",
        ratingStars: 45, // Mapping to your rating-45.png
        ratingCount: 2197,
        keywords: ["kitchen", "appliances", "toaster"],
        basePrice: 2000.00,
        unitType: "piece",
        isAvailable: true,
      },
      {
        vendorId: 1,
        categoryId: apparel.id,
        name: "Adults Plain Cotton T-Shirt - 2 Pack",
        description: "Soft, breathable cotton t-shirts in teal.",
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        ratingStars: 40,
        ratingCount: 56,
        keywords: ["tshirts", "apparel", "mens"],
        basePrice: 25000.00,
        unitType: "pack",
        isAvailable: true,
      },
      {
        vendorId: 1,
        categoryId: electronics.id,
        name: "Noise Cancelling Headphones",
        description: "Immersive audio with long battery life.",
        image: "images/products/variations/noise-cancelling-headphones-black.jpg",
        ratingStars: 50,
        ratingCount: 342,
        keywords: ["audio", "headphones", "tech"],
        basePrice: 12900.00,
        unitType: "piece",
        isAvailable: true,
      }
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });