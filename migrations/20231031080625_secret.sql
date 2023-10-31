-- Add migration script here
DROP TABLE IF EXISTS secret;

CREATE TABLE `secret` (
	`id` VARCHAR(36) NOT NULL DEFAULT (UUID()) COLLATE 'utf8mb4_0900_ai_ci',
	`secret` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`description` VARCHAR(64) NOT NULL DEFAULT '' COLLATE 'utf8mb4_0900_ai_ci',
	`expired_at` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;