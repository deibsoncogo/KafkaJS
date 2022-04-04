import express from "express";
import { CompressionTypes } from "kafkajs";

const routes = express.Router();

routes.post('/service', async (request, response) => {
  const message = {
    user: { id: 1, name: "Diego Fernandes" },
    course: "Kafka com Node JS",
    grade: 5,
  }

  await request.producer.send({
    topic: "issue-service",
    compression: CompressionTypes.GZIP,
    messages: [{ value: JSON.stringify(message) }]
  })

  return response.status(200).json({ message: "Hello word" });
});

export default routes;
