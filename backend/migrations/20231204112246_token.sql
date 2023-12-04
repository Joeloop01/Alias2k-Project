-- Add migration script here
CREATE TABLE token (
    token int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    refresh_token int(11) NOT NULL,
    expire_in time,
    PRIMARY KEY (token)
);