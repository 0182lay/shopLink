import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkDatabaseConnection = async (
    retries = 3,
    delayMs = 1500,
) => {
    for (let attempt = 1; attempt <= retries; attempt += 1) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error(
                `Database connection check failed (${attempt}/${retries})`,
            );
            console.error(error);

            if (attempt < retries) {
                await wait(delayMs);
            }
        }
    }

    return false;
};
