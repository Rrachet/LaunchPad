const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");

async function seedUsers() {
  const users = [
    {
      email: "amar@admin.com",
      name: "Admin",
      password: "admin123",
      role: "admin",
    },
    {
      email: "amar@client.com",
      name: "Client 1",
      password: "client123",
      role: "user",
    },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log(`[seed] ${u.email} already exists, updating role/verified.`);
      await prisma.user.update({
        where: { email: u.email },
        data: {
          role: u.role,
          emailVerified: true,
          passwordVerified: true,
        },
      });
      continue;
    }

    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        emailVerified: true,
        passwordVerified: true,
      },
    });
    console.log(`[seed] Created ${u.email} (${u.role})`);
  }
}

async function main() {
  try {
    await seedUsers();
    console.log("[seed] Done.");
  } catch (e) {
    console.error("[seed] ERROR:", e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
