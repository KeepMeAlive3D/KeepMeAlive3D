val kotlin_version: String by project
val logback_version: String by project
val flaxoos_extra_plugins_version: String by project

plugins {
    kotlin("jvm") version "2.0.21"
    id("io.ktor.plugin") version "3.0.0-rc-2"
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.21"
}

group = "de.keepmealive3d"
version = "0.0.1"

application {
    mainClass.set("de.keepmealive3d.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
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
    implementation("io.ktor:ktor-server-webjars-jvm")
    implementation("org.webjars:jquery:3.7.1")
    implementation("io.github.smiley4:ktor-swagger-ui:2.9.0")
    implementation("io.ktor:ktor-server-resources-jvm")
    implementation("io.ktor:ktor-server-host-common-jvm")
    implementation("io.ktor:ktor-server-compression-jvm")
    implementation("io.ktor:ktor-server-cors-jvm")
    implementation("io.ktor:ktor-server-call-logging-jvm")
    implementation("io.ktor:ktor-server-metrics-jvm")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    //implementation("io.github.flaxoos:ktor-server-kafka-jvm:$flaxoos_extra_plugins_version")
    implementation("io.ktor:ktor-server-websockets-jvm")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    testImplementation("io.ktor:ktor-server-test-host-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")

    implementation("com.charleskorn.kaml:kaml:0.61.0")
    implementation(group = "org.eclipse.paho", "org.eclipse.paho.client.mqttv3", "1.2.5")
}
