import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "service",
  brokers: ["localhost:9092"],
  logLevel: logLevel.NOTHING,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  }
});

const topic = "issue-service";
const consumer = kafka.consumer({ groupId: "service-group" });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}#${message.value}`);
    }
  });
}

run().catch(console.error);
