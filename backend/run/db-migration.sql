CREATE SCHEMA kma;

CREATE TABLE kma.users (
    id int primary key auto_increment,
    login_type enum('OAUTH', 'BASIC') not null,
    password VARBINARY(255),
    name VARCHAR(255) unique
);
