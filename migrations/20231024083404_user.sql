-- Add migration script here
CREATE TABLE user (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
);