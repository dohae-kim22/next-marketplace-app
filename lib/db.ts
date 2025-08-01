import { PrismaClient } from "./generated/prisma";

const db = new PrismaClient();
console.log("new connnection");

export default db;
