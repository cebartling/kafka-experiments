package com.pintailconsultingllc.kafkaexperiments.experiment1.producer.controllers

import com.pintailconsultingllc.kafkaexperiments.experiment1.producer.data.KafkaMessageRequest
import com.pintailconsultingllc.kafkaexperiments.experiment1.producer.services.KafkaProducerService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono


@RestController
@RequestMapping("/api/messages")
class KafkaMessageController(private val kafkaProducerService: KafkaProducerService) {

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun sendMessage(@RequestBody request: KafkaMessageRequest): Mono<Void> {
        kafkaProducerService.sendMessage(request.topic, request.key, request.message)
        return Mono.empty()
    }
}