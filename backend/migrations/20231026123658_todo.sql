-- Add migration script here
CREATE TABLE todo (
    id int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(255) NULL,
    completed_at datetime NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at datetime NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_USER_TODO FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);