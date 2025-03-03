CREATE SCHEMA IF NOT EXISTS kma;

CREATE TABLE IF NOT EXISTS kma.users
(
    id         INT PRIMARY KEY auto_increment,
    login_type ENUM ('OAUTH', 'BASIC') NOT NULL,
    password   VARBINARY(255),
    name       VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS kma.events
(
    id        INT PRIMARY KEY auto_increment,
    type      ENUM ('TOPIC_DATAPOINT','ANIMATION_POSITION','ERROR','SUBSCRIBE_TOPIC') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source    VARCHAR(255)                                                            NOT NULL,
    topic     VARCHAR(255)                                                            NOT NULL,
    data      VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS kma.models
(
    id              INT PRIMARY KEY auto_increment,
    filename        VARCHAR(255) NOT NULL,
    model_name      VARCHAR(255) NOT NULL,
    owner           INT          NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    light_intensity DOUBLE    DEFAULT 1.0,
    scale           DOUBLE    DEFAULT 1.0
);