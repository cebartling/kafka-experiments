import { Consumer, EachMessagePayload, Kafka } from "kafkajs";

export class KafkaConsumerService {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private clientId: string = "experiment-01-app",
    private groupId: string = "experiment-01-group",
    private brokers: string[] = ["localhost:9092"],
  ) {
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    });

    this.consumer = this.kafka.consumer({ groupId: this.groupId });
  }

  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("Kafka consumer connected successfully");
    } catch (error) {
      console.error("Failed to connect Kafka consumer:", error);
      throw error;
    }
  }

  async subscribe(topics: string[]): Promise<void> {
    try {
      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        console.log(`Subscribed to topic: ${topic}`);
      }
    } catch (error) {
      console.error("Failed to subscribe to topics:", error);
      throw error;
    }
  }

  async startConsuming(
    messageHandler?: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: messageHandler || this.defaultMessageHandler,
      });
      console.log("Started consuming messages...");
    } catch (error) {
      console.error("Error while consuming messages:", error);
      throw error;
    }
  }

  private defaultMessageHandler = async ({
    topic,
    partition,
    message,
  }: EachMessagePayload): Promise<void> => {
    console.log({
      topic,
      partition,
      offset: message.offset,
      key: message.key?.toString(),
      value: message.value?.toString(),
      timestamp: message.timestamp,
    });
  };

  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Kafka consumer disconnected");
    } catch (error) {
      console.error("Error disconnecting consumer:", error);
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log("Shutting down Kafka consumer...");
    await this.disconnect();
  }
}
