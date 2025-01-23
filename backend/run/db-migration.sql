CREATE SCHEMA kma;

CREATE TABLE kma.users
(
    id         INT PRIMARY KEY auto_increment,
    login_type ENUM('OAUTH', 'BASIC') NOT NULL,
    password   VARBINARY(255),
    name       VARCHAR(255) UNIQUE
);

CREATE TABLE kma.events
(
    id        INT PRIMARY KEY auto_increment,
    type      ENUM('TOPIC_DATAPOINT','ANIMATION_POSITION','ERROR','SUBSCRIBE_TOPIC') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source    VARCHAR(255) NOT NULL,
    topic     VARCHAR(255) NOT NULL,
    data      VARCHAR(255)
)