CREATE TABLE links(
    id INT NOT NULL AUTO_INCREMENT,
    guild TEXT NOT NULL,
    links TEXT NOT NULL,
    terms TEXT NOT NULL,
PRIMARY KEY (id));

CREATE TABLE tickets(
    id INT NOT NULL AUTO_INCREMENT,
    guild TEXT,
    data LONGTEXT,
    panel TEXT,
    claimedBy TEXT,
    closedBy TEXT,
    openedBy TEXT,
    openerId TEXT,
    dateClosed TEXT,
    ticketID BIGINT,
    users TEXT,
PRIMARY KEY (id));

CREATE TABLE transcripts(
    id INT NOT NULL AUTO_INCREMENT,
    guild TEXT,
    data LONGTEXT,
    panel TEXT,
    archivedBy TEXT,
    openedBy TEXT,
    ticketID TEXT,
    dateArchived TEXT,
    users TEXT,
PRIMARY KEY (id));

CREATE TABLE applications(
    id INT NOT NULL AUTO_INCREMENT,
    guild TEXT,
    data LONGTEXT,
    panel TEXT,
    applicant TEXT,
    timeTaken TEXT,
    dateSubmitted TEXT,
    applicationID TEXT,
    applicantID TEXT,
    users TEXT,
PRIMARY KEY (id));

CREATE TABLE prunes(
    id INT NOT NULL AUTO_INCREMENT,
    guild TEXT,
    data LONGTEXT,
    dateClosed TEXT,
    prunedBy TEXT,
    users TEXT,
PRIMARY KEY (id));

CREATE TABLE users(
    id INT AUTO_INCREMENT,
    user TEXT,
    username TEXT,
    tag TEXT,
    icon TEXT,
PRIMARY KEY (id));

ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE prunes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE applications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE transcripts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE tickets CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE links CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;