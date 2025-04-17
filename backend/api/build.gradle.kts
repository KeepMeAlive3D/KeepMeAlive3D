val kotlin_version: String by project
val logback_version: String by project
val flaxoos_extra_plugins_version: String by project

plugins {
    kotlin("jvm") version "2.1.20"
    id("io.ktor.plugin") version "3.1.2"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.1.20"
}

group = "de.keepmealive3d"
version = System.getenv("GITHUB_REF")?.removePrefix("refs/tags/") ?: "0.1-local"   //use tag name as version

application {
    mainClass.set("io.ktor.server.netty.EngineMain")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(23))
    }
}

gradle.taskGraph.whenReady {
    println("DETECTED VERSION: ${version}")
    layout
        .projectDirectory
        .asFile
        .resolve("src")
        .resolve("main")
        .resolve("resources")
        .resolve("kma_version")
        .writeText(version.toString())
}

repositories {
    mavenCentral()
    maven { url = uri("https://packages.confluent.io/maven/") }
    maven { url = uri("https://repo.eclipse.org/content/repositories/paho-releases/") }
}

dependencies {
    implementation("io.ktor:ktor-server-core-jvm")
    implementation("io.ktor:ktor-server-auth-jvm")
    implementation("io.ktor:ktor-server-sessions-jvm")
    implementation("org.webjars:jquery:3.7.1")
    implementation("io.ktor:ktor-server-openapi")
    implementation("io.ktor:ktor-server-swagger-jvm")
    implementation("io.ktor:ktor-server-resources-jvm")
    implementation("io.ktor:ktor-server-host-common-jvm")
    implementation("io.ktor:ktor-server-compression-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-call-logging-jvm")
    implementation("io.ktor:ktor-server-metrics-jvm")
    implementation("io.ktor:ktor-server-status-pages")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    //implementation("io.github.flaxoos:ktor-server-kafka-jvm:$flaxoos_extra_plugins_version")
    implementation("io.ktor:ktor-server-websockets-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.ktor:ktor-client-core-jvm:3.1.2")
    implementation("io.ktor:ktor-client-apache-jvm:3.1.2")
    testImplementation("io.ktor:ktor-server-test-host-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
    testImplementation("io.ktor:ktor-client-content-negotiation")
    testImplementation("io.mockk:mockk:1.14.0")
    implementation("io.ktor:ktor-server-auth-jwt")

    implementation("com.charleskorn.kaml:kaml:0.76.0")
    implementation(group = "org.eclipse.paho", "org.eclipse.paho.client.mqttv3", "1.2.5")

    //db
    implementation(group="org.ktorm", name = "ktorm-support-mysql", version = "4.1.1")
    implementation("com.mysql:mysql-connector-j:9.2.0")

    // Koin for Ktor
    implementation("io.insert-koin:koin-ktor:4.0.4")
    // SLF4J Logger
    implementation("io.insert-koin:koin-logger-slf4j:4.0.4")
    // https://mvnrepository.com/artifact/io.insert-koin/koin-core
    implementation("io.insert-koin:koin-core:4.0.4")
    // https://mvnrepository.com/artifact/io.insert-koin/koin-test
    testImplementation("io.insert-koin:koin-test:4.0.4")
    // https://mvnrepository.com/artifact/io.insert-koin/koin-test-junit5
    testImplementation("io.insert-koin:koin-test-junit5:4.0.4")

    // https://mvnrepository.com/artifact/io.insert-koin/koin-ktor
    implementation("io.insert-koin:koin-ktor:4.0.4")
    // https://mvnrepository.com/artifact/io.insert-koin/koin-logger-slf4j
    implementation("io.insert-koin:koin-logger-slf4j:4.0.4")

    implementation("at.favre.lib:bcrypt:0.10.2")

    implementation("com.influxdb:influxdb-client-kotlin:7.2.0")
}
