import { KafkaConsumerService } from "./service";

// Usage example
async function main() {
  const consumerService = new KafkaConsumerService(
    "experiment-01-app",
    "experiment-01-group",
    ["localhost:9092"],
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
    await consumerService.subscribe(["experiment-01-topic"]);

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
