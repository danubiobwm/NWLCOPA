import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Joana Maria",
      email: "joana.maria@gmail.com",
      avatarUrl: "http://github.com/danubiobwm.png",
    },
  });

  const pool = prisma.pool.create({
    data: {
      title: "Example Pool2",
      code: "BOL124",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });
  await prisma.game.create({
    data: {
      date: "2022-11-04T13:12:10.892Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-05T13:12:10.892Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: (await pool).id,
              },
            },
          },
        },
      },
    },
  });
}

main();
