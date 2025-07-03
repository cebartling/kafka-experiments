package com.pintailconsultingllc.kafkaexperiments.experiment1.producer.services

import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service

@Service
class KafkaProducerService(private val kafkaTemplate: KafkaTemplate<String, String>) {

    fun sendMessage(topic: String, key: String, message: String) {
        kafkaTemplate.send(topic, key, message)
    }
}