CREATE TABLE users(
    id INT AUTO_INCREMENT,
    user TEXT,
    username TEXT,
    tag TEXT,
    icon TEXT,
PRIMARY KEY (id));

ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;