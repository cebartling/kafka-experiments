# Kafka Experiment 4

## Experiment Overview

This Git repository is a minimal Kafka experiment designed to explore Apache Kafka functionality in a local development environment. It uses a single docker-compose.yml file to provision a basic Kafka stack consisting of one core services:

-	Kafka Broker: A standalone Kafka service configured KRaft mode and expose a listener on the default port (9092).
- Schema Registry: A standalone Schema Registry service configured to work with Kafka in KRaft mode.

Key Features
- Local-Only Deployment: The setup is self-contained, intended for local testing and experimentation without external dependencies.
-	Quick Start: Developers can spin up the environment using a single docker-compose up command.
-	Educational Purpose: Ideal for exploring Kafka basics such as producing and consuming messages, testing CLI tools (kafka-console-producer.sh, kafka-console-consumer.sh), and validating configuration experiments.


## Implementation

Here is a variant of your Kafka experiment repository that uses Kafka in KRaft mode, which eliminates the need for Zookeeper. This is ideal for local development or testing with the latest Kafka architecture. It uses a standalone docker-compose.yml file to start the Kafka service with embedded metadata management—no Zookeeper involved.


Key Configuration Details
-	KRaft mode enabled using `KAFKA_PROCESS_ROLES=broker,controller`.
-	Single-node controller quorum with `KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka:9093`.
-	No Zookeeper dependency at all.
-	Data persisted in a Docker volume to preserve state between restarts.
-	The Schema Registry connects to the Kafka broker using the internal Docker hostname broker:29092, which matches the PLAINTEXT listener on the broker.
-	The use of the `apache/kafka` base and `confluentinc/cp-schema-registry` image is fine — Schema Registry works with any Kafka, as long as it can access the broker over a valid listener.

## Usage

### Docker Compose Commands
`docker compose up`
`docker compose down`
`docker compose reset`
`docker compose logs`
`docker compose exec kafka kafka-topics.sh --list --bootstrap-server kafka:9092`
`docker compose exec kafka kafka-console-producer.sh --broker-list kafka:9092 --topic my-topic`
