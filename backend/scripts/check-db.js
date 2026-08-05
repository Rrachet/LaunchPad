const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const userCols = await prisma.$queryRawUnsafe(
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'User'"
  );
  console.log("User columns:", userCols.map((x) => x.column_name).join(", "));

  const otpTables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_name = 'EmailOtp'"
  );
  console.log("EmailOtp table exists:", otpTables.length > 0);
}

main()
  .catch((e) => console.log("ERROR:", e.message))
  .finally(() => prisma.$disconnect());
