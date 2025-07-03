import { KafkaConsumerService } from "./service";

const TOPIC = "experiment-01-topic";
const CONSUMER_GROUP_ID = "experiment-01-group";
const KAFKA_CLIENT_ID =
  process.env.KAFKA_CLIENT_ID || "typescript-kafka-consumer";
const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092";

// Usage example
async function main() {
  const consumerService = new KafkaConsumerService(
    KAFKA_CLIENT_ID,
    CONSUMER_GROUP_ID,
    [KAFKA_BROKER],
  );

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down gracefully...");
    await consumerService.shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    await consumerService.shutdown();
    process.exit(0);
  });

  try {
    // Connect to Kafka
    await consumerService.connect();

    // Subscribe to topics
    await consumerService.subscribe([TOPIC]);

    // Start consuming with custom message handler
    await consumerService.startConsuming(
      async ({ topic, partition, message }) => {
        console.log(`Processing message from ${topic}:${partition}`);

        // Parse JSON message if needed
        try {
          const data = JSON.parse(message.value?.toString() || "{}");
          console.log("Parsed data:", data);

          // Add your business logic here
          // await processMessage(data);
        } catch (parseError) {
          console.error("Failed to parse message as JSON:", parseError);
          console.log("Raw message:", message.value?.toString());
        }
      },
    );
  } catch (error) {
    console.error("Application error:", error);
    await consumerService.shutdown();
    process.exit(1);
  }
}

// Run the consumer
if (require.main === module) {
  main().catch(console.error);
}

export { KafkaConsumerService };
