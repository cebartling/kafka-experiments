import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

class KafkaConsumerService {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private clientId: string = 'my-consumer-app',
    private groupId: string = 'my-consumer-group',
    private brokers: string[] = ['localhost:9092']
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
      console.log('Kafka consumer connected successfully');
    } catch (error) {
      console.error('Failed to connect Kafka consumer:', error);
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
      console.error('Failed to subscribe to topics:', error);
      throw error;
    }
  }

  async startConsuming(messageHandler?: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: messageHandler || this.defaultMessageHandler,
      });
      console.log('Started consuming messages...');
    } catch (error) {
      console.error('Error while consuming messages:', error);
      throw error;
    }
  }

  private defaultMessageHandler = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
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
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting consumer:', error);
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('Shutting down Kafka consumer...');
    await this.disconnect();
  }
}

// Usage example
async function main() {
  const consumerService = new KafkaConsumerService(
    'my-app',
    'my-group',
    ['localhost:9092']
  );

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await consumerService.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await consumerService.shutdown();
    process.exit(0);
  });

  try {
    // Connect to Kafka
    await consumerService.connect();

    // Subscribe to topics
    await consumerService.subscribe(['my-topic', 'another-topic']);

    // Start consuming with custom message handler
    await consumerService.startConsuming(async ({ topic, partition, message }) => {
      console.log(`Processing message from ${topic}:${partition}`);

      // Parse JSON message if needed
      try {
        const data = JSON.parse(message.value?.toString() || '{}');
        console.log('Parsed data:', data);

        // Add your business logic here
        // await processMessage(data);

      } catch (parseError) {
        console.error('Failed to parse message as JSON:', parseError);
        console.log('Raw message:', message.value?.toString());
      }
    });

  } catch (error) {
    console.error('Application error:', error);
    await consumerService.shutdown();
    process.exit(1);
  }
}

// Run the consumer
if (require.main === module) {
  main().catch(console.error);
}

export { KafkaConsumerService };
