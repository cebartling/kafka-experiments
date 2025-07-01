# Kafka Experiment 2

## Experiment Overview

This Git repository is a minimal Kafka experiment designed to explore Apache Kafka functionality in a local development environment. It uses a single docker-compose.yml file to provision a basic Kafka stack consisting of one core services:

-	Kafka Broker: A standalone Kafka service configured KRaft mode and expose a listener on the default port (9092).

Key Features
- Local-Only Deployment: The setup is self-contained, intended for local testing and experimentation without external dependencies.
-	Quick Start: Developers can spin up the environment using a single docker-compose up command.
-	Educational Purpose: Ideal for exploring Kafka basics such as producing and consuming messages, testing CLI tools (kafka-console-producer.sh, kafka-console-consumer.sh), and validating configuration experiments.


## Implementation

Here is a variant of your Kafka experiment repository that uses Kafka in KRaft mode, which eliminates the need for Zookeeper. This is ideal for local development or testing with the latest Kafka architecture.

This version of the repository uses a single Kafka broker running in KRaft (Kafka Raft Metadata mode). It uses a standalone docker-compose.yml file to start the Kafka service with embedded metadata management—no Zookeeper involved.


Key Configuration Details
	•	KRaft mode enabled using KAFKA_PROCESS_ROLES=broker,controller.
	•	Single-node controller quorum with KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka:9093.
	•	No Zookeeper dependency at all.
	•	Data persisted in a Docker volume to preserve state between restarts.


## Usage


### Start Kafka
`make up`

### Tail logs
make logs

### Stop Kafka
`make down`

### Reset everything (volume wipe + re-init)
`make reset`

### Check status
`make status`
