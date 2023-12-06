-- Add migration script here
DROP TABLE IF EXISTS token;

CREATE TABLE `token` (
	`token` VARCHAR(128) NOT NULL,
	`user_id` int(11) NOT NULL,
	`refresh_token` VARCHAR(128) NOT NULL,
	`expired_at` DATETIME NOT NULL,
	PRIMARY KEY (`token`)
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;