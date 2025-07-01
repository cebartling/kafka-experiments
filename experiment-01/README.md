# Kafka Experiment 1

## Experiment Overview

This Git repository is a minimal Kafka experiment designed to explore Apache Kafka functionality in a local development environment. It uses a single docker-compose.yml file to provision a basic Kafka stack consisting of two core services:

-	Zookeeper: Provides coordination and metadata management for the Kafka broker. It’s a required component in Kafka’s classic architecture (not using KRaft mode).
-	Kafka Broker: A standalone Kafka service configured to register with the Zookeeper instance and expose a listener on the default port (9092).

Key Features
- Local-Only Deployment: The setup is self-contained, intended for local testing and experimentation without external dependencies.
-	Quick Start: Developers can spin up the environment using a single docker-compose up command.
-	Educational Purpose: Ideal for exploring Kafka basics such as producing and consuming messages, testing CLI tools (kafka-console-producer.sh, kafka-console-consumer.sh), and validating configuration experiments.


## Implementation

### Starting Docker Compose

```zsh
docker compose up
```

### Stopping Docker Compose

```zsh
docker compose down
```

### Restarting Docker Compose

```zsh
docker compose restart
```
