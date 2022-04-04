import express from "express";
import { Kafka, logLevel } from "kafkajs";
import routes from "./routes";

const app = express();

app.use(express.json());

const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  }
});

const producer = kafka.producer();

app.use((request, response, next) => {
  request.producer = producer;
  return next();
})

app.use(routes);

async function run() {
  await producer.connect();

  app.listen(3333, () => {
    console.log("The server is running on port 3333");
  });
}

run().catch(console.error);
