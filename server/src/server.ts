import Fastify from "fastify";
import cors from "@fastify/cors";
import z from "zod";
import ShortUniqueId from 'short-unique-id';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(cors, {
    origin: true,
  });

  //routes
  // get
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.get("/users/count", async () => {
    const count = await prisma.user.count();
    return { count };
  });

  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  // create
  fastify.post("/pools", async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createPoolBody.parse(request.body);
    const generated = new ShortUniqueId({length:6});
    const code = String(generated()).toUpperCase();

    await prisma.pool.create({
      data: {
        title,
        code
      },
    });

    return reply.status(201).send({ code });
  });



  await fastify.listen({ port: 3333 /*host: "0.0.0.0"*/ });
}
bootstrap();
