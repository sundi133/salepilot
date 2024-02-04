const { PrismaClient } = require('@prisma/client');

let prisma;

// In development, use a global variable to store the instance
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = prisma;
