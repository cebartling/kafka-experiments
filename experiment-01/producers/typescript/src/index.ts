import { ProducerMessage } from "./types";
import { KafkaProducerService } from "./service";

// Usage examples
async function main() {
  const producerService = new KafkaProducerService("experiment-01-app", [
    "localhost:9092",
  ]);

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down gracefully...");
    await producerService.shutdown();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    await producerService.shutdown();
    process.exit(0);
  });

  try {
    // Connect to Kafka
    await producerService.connect();

    // Example 1: Send a simple message
    await producerService.sendMessage("experiment-01-topic", {
      key: "user-123",
      value: "User logged in",
    });

    // Example 2: Send a JSON object
    await producerService.sendJSON(
      "experiment-01-topic",
      {
        userId: 123,
        action: "login",
        timestamp: new Date().toISOString(),
        metadata: {
          ip: "192.168.1.100",
          userAgent: "Mozilla/5.0...",
        },
      },
      "user-123",
    );

    // Example 3: Send multiple messages
    await producerService.sendMessages("experiment-01-topic", [
      {
        key: "sensor-1",
        value: { temperature: 23.5, humidity: 65 },
      },
      {
        key: "sensor-2",
        value: { temperature: 24.1, humidity: 62 },
      },
    ]);

    // Example 4: Send with headers and specific partition
    await producerService.sendMessage("experiment-01-topic", {
      key: "order-456",
      value: {
        orderId: 456,
        customerId: 789,
        amount: 99.99,
        status: "pending",
      },
      partition: 0,
      headers: {
        "Content-Type": "application/json",
        Source: "order-service",
        Version: "1.0",
      },
    });

    // Example 5: Batch send to multiple topics
    await producerService.sendBatch([
      {
        topic: "experiment-01-topic",
        messages: [
          { key: "user-1", value: JSON.stringify({ action: "signup" }) },
          { key: "user-2", value: JSON.stringify({ action: "login" }) },
        ],
      },
      {
        topic: "analytics",
        messages: [
          {
            value: JSON.stringify({
              event: "page_view",
              page: "/dashboard",
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      },
    ]);

    // Example 6: Continuous message production (for testing)
    console.log("Starting continuous message production...");
    let counter = 0;
    const interval = setInterval(async () => {
      try {
        await producerService.sendJSON("heartbeat", {
          id: counter++,
          timestamp: new Date().toISOString(),
          status: "alive",
        });

        if (counter >= 10) {
          clearInterval(interval);
          console.log("Finished sending heartbeat messages");
          await producerService.shutdown();
          process.exit(0);
        }
      } catch (error) {
        console.error("Error sending heartbeat:", error);
        clearInterval(interval);
      }
    }, 1000);
  } catch (error) {
    console.error("Application error:", error);
    await producerService.shutdown();
    process.exit(1);
  }
}

// Run the producer
if (require.main === module) {
  main().catch(console.error);
}

export { KafkaProducerService, ProducerMessage };
