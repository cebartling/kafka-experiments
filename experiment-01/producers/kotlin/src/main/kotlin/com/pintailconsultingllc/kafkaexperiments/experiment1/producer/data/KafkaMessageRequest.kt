package com.pintailconsultingllc.kafkaexperiments.experiment1.producer.data

data class KafkaMessageRequest(
    val topic: String,
    val key: String,
    val message: String
)
