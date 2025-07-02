import {
  Kafka,
  Message,
  Producer,
  ProducerRecord,
  RecordMetadata,
} from "kafkajs";
import { ProducerMessage } from "./types";

export class KafkaProducerService {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;

  constructor(
    private clientId: string = "experiment-01-app",
    private brokers: string[] = ["localhost:9092"],
  ) {
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: false,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log("Kafka producer connected successfully");
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log("Kafka producer disconnected");
    } catch (error) {
      console.error("Error disconnecting producer:", error);
    }
  }

  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error("Producer is not connected. Call connect() first.");
    }
  }

  private formatMessage(message: ProducerMessage): Message {
    let value: string;

    if (typeof message.value === "object") {
      value = JSON.stringify(message.value);
    } else {
      value = message.value;
    }

    const kafkaMessage: Message = {
      value,
    };

    if (message.key) {
      kafkaMessage.key = message.key;
    }

    if (message.partition !== undefined) {
      kafkaMessage.partition = message.partition;
    }

    if (message.headers) {
      kafkaMessage.headers = message.headers;
    }

    if (message.timestamp) {
      kafkaMessage.timestamp = message.timestamp;
    }

    return kafkaMessage;
  }

  async sendMessage(
    topic: string,
    message: ProducerMessage,
  ): Promise<RecordMetadata[]> {
    this.ensureConnected();

    try {
      const kafkaMessage = this.formatMessage(message);

      const result = await this.producer.send({
        topic,
        messages: [kafkaMessage],
      });

      console.log(`Message sent to topic ${topic}:`, {
        partition: result[0].partition,
        offset: result[0].offset,
        key: message.key,
      });

      return result;
    } catch (error) {
      console.error(`Failed to send message to topic ${topic}:`, error);
      throw error;
    }
  }

  async sendMessages(
    topic: string,
    messages: ProducerMessage[],
  ): Promise<RecordMetadata[]> {
    this.ensureConnected();

    try {
      const kafkaMessages = messages.map((msg) => this.formatMessage(msg));

      const result = await this.producer.send({
        topic,
        messages: kafkaMessages,
      });

      console.log(`${messages.length} messages sent to topic ${topic}`);
      return result;
    } catch (error) {
      console.error(`Failed to send messages to topic ${topic}:`, error);
      throw error;
    }
  }

  async sendBatch(
    producerRecords: ProducerRecord[],
  ): Promise<RecordMetadata[]> {
    this.ensureConnected();

    try {
      const result = await this.producer.sendBatch({
        topicMessages: producerRecords,
      });

      console.log(`Batch sent to ${producerRecords.length} topics`);
      return result;
    } catch (error) {
      console.error("Failed to send batch:", error);
      throw error;
    }
  }

  // Convenience method for sending JSON objects
  async sendJSON(
    topic: string,
    data: object,
    key?: string,
  ): Promise<RecordMetadata[]> {
    return this.sendMessage(topic, {
      key,
      value: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Convenience method for sending with automatic timestamp
  async sendWithTimestamp(
    topic: string,
    message: ProducerMessage,
  ): Promise<RecordMetadata[]> {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toISOString(),
    };

    return this.sendMessage(topic, messageWithTimestamp);
  }

  // Method for transactions (requires idempotent producer)
  async sendTransaction(producerRecords: ProducerRecord[]): Promise<void> {
    this.ensureConnected();

    const transaction = await this.producer.transaction();

    try {
      for (const record of producerRecords) {
        await transaction.send(record);
      }

      await transaction.commit();
      console.log("Transaction committed successfully");
    } catch (error) {
      await transaction.abort();
      console.error("Transaction aborted:", error);
      throw error;
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log("Shutting down Kafka producer...");
    await this.disconnect();
  }
}
