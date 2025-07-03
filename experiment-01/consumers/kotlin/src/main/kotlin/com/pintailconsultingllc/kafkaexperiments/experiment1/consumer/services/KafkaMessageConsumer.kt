package com.pintailconsultingllc.kafkaexperiments.experiment1.consumer.services

import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class KafkaMessageConsumer {

    @KafkaListener(topics = ["experiment-01-topic"], groupId = "experiment-01-kotlin-consumer-group")
    fun listen(message: String) {
        println("Received message: $message")
    }
}