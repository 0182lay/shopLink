import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const store = await prisma.store.upsert({
        where: {
            slug: "pet-shop",
        },
        update: {
            name: "Pet Shop",
            description: "Pet food, toys, and accessories",
            isActive: true,
            deletedAt: null,
        },
        create: {
            name: "Pet Shop",
            slug: "pet-shop",
            description: "Pet food, toys, and accessories",
            isActive: true,
        },
    });

    const category = await prisma.category.upsert({
        where: {
            storeId_slug: {
                storeId: store.id,
                slug: "pet-food",
            },
        },
        update: {
            name: "Pet Food",
            isActive: true,
            deletedAt: null,
        },
        create: {
            storeId: store.id,
            name: "Pet Food",
            slug: "pet-food",
            isActive: true,
        },
    });

    await prisma.product.upsert({
        where: {
            id: 1,
        },
        update: {
            storeId: store.id,
            categoryId: category.id,
            name: "Premium Dog Food",
            description: "Healthy food for adult dogs",
            price: 450,
            stock: 20,
            isActive: true,
            isFeatured: true,
            deletedAt: null,
        },
        create: {
            storeId: store.id,
            categoryId: category.id,
            name: "Premium Dog Food",
            description: "Healthy food for adult dogs",
            price: 450,
            stock: 20,
            isActive: true,
            isFeatured: true,
        },
    });

    console.log("Seed completed");
}

main()
    .catch((error) => {
        console.error("Seed failed");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
