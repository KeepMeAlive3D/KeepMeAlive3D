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
    implementation("io.github.flaxoos:ktor-server-kafka-jvm:$flaxoos_extra_plugins_version")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

kotlin {
    jvmToolchain(11)
}