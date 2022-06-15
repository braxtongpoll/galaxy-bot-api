CREATE TABLE mail(
    id INT AUTO_INCREMENT,
    openedBy TEXT,
    closedBy TEXT,
    messages TEXT,
    users TEXT,
    guild TEXT,
PRIMARY KEY (id));

ALTER TABLE mail CONVERT TO CHARACTER SET utf8mb4 COLLATe utf8mb4_unicode_520_ci;