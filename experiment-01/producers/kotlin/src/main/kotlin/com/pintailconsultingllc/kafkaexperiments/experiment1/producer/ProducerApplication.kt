package com.pintailconsultingllc.kafkaexperiments.experiment1.producer

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ProducerApplication

fun main(args: Array<String>) {
	runApplication<ProducerApplication>(*args)
}
