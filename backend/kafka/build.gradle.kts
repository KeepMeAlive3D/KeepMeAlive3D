val kotlin_version: String by project
val flaxoos_extra_plugins_version: String by project

plugins {
    kotlin("jvm") version "2.0.20"
    id("io.ktor.plugin") version "3.0.0-rc-2"
}

group = "de.keepmealive3d"
version = "0.1.0"

repositories {
    mavenCentral()
}

dependencies {
    compileOnly("io.ktor:ktor-server-core-jvm")
    compileOnly(project(":api"))

    // https://mvnrepository.com/artifact/io.confluent/kafka-avro-serializer
    implementation("io.confluent:kafka-avro-serializer:5.3.0")

    // https://mvnrepository.com/artifact/io.confluent/kafka-schema-registry-client
    implementation("io.confluent:kafka-schema-registry-client:5.3.0")


    implementation("io.github.flaxoos:ktor-server-kafka-jvm:$flaxoos_extra_plugins_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

kotlin {
    jvmToolchain(11)
}