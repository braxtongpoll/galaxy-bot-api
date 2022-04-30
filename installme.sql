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

ALTER TABLE prunes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE applications CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE transcripts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE tickets CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE links CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;


INSERT INTO tickets (guild, data, panel, claimedBy, closedBy, openedBy, openerId, dateClosed, ticketID, users) VALUES ('704379982012743721', '[{"author":{"name":"PlutoTheDev","iconURL":"https://cdn.discordapp.com/avatars/399718367335940117/710c5b6ed073289edd3148fca1d58789.png?size=512","ID":"399718367335940117"},"message":"<@!802459473612505099>","embeds":[]},{"author":{"name":"Jordan.","iconURL":"https://cdn.discordapp.com/avatars/802459473612505099/a_2b9203aee935dd8a6ef6a1069948818a.gif?size=512","ID":"802459473612505099"},"message":"please elaborate","embeds":[]},{"author":{"name":"KA$","iconURL":"https://cdn.discordapp.com/avatars/803409756860842055/42d528cb3a4e31bdbe0f3cceef9de1f0.png?size=512","ID":"803409756860842055"},"message":"Automatic Dispatch System if no one is online as a dispatch member. Let''s say I''m in a radio channel 1, this would be the main channel with all the officers in it. Now once a /911 call comes through it would assign 1-2, putting them on a different radio channel. It''d give one person permission that got assigned like Call Command meaning they''d be in charge off the call / scene so they could request more units that are in radio 1. /br/brThere''d could be some type of menu where you could request a number of units and they''d get moved to the radio and assigned to the call etc. You could also transfer Call Command etc./br/brNow let''s see I need more addition units. There would be a unit where I could request more addition units such as 1,2,3 etc. If there enough people in the Central radio channel (1) it''d bring the people I requested to my radio channel./br/brNow let''s say there is a SWAT / Air 1 Radio channel etc you could request units from there and they''d automatically be assigned if available / in their radio channel.","embeds":[]},{"author":{"name":"KA$","iconURL":"https://cdn.discordapp.com/avatars/803409756860842055/42d528cb3a4e31bdbe0f3cceef9de1f0.png?size=512","ID":"803409756860842055"},"message":"He''s a short brief example, <@!802459473612505099>. Sorry for the ping.","embeds":[]},{"author":{"name":"Jordan.","iconURL":"https://cdn.discordapp.com/avatars/802459473612505099/a_2b9203aee935dd8a6ef6a1069948818a.gif?size=512","ID":"802459473612505099"},"message":"gotcha, i’ll read this and try and make a plan to see if i can do it when i get home","embeds":[]},{"author":{"name":"KA$","iconURL":"https://cdn.discordapp.com/avatars/803409756860842055/42d528cb3a4e31bdbe0f3cceef9de1f0.png?size=512","ID":"803409756860842055"},"message":"Alrighty! If you need a more complex like briefing regarding it I''ll type one out.","embeds":[]},{"author":{"name":"KA$","iconURL":"https://cdn.discordapp.com/avatars/803409756860842055/42d528cb3a4e31bdbe0f3cceef9de1f0.png?size=512","ID":"803409756860842055"},"message":"Example of some type of menu it''d have","embeds":[]},{"author":{"name":"KA$","iconURL":"https://cdn.discordapp.com/avatars/803409756860842055/42d528cb3a4e31bdbe0f3cceef9de1f0.png?size=512","ID":"803409756860842055"},"message":"where you could request certain units from their radio channel and if available they''d get assign to the call you''re in.","embeds":[]},{"author":{"name":"Sin","iconURL":"https://cdn.discordapp.com/avatars/771935774903894037/a0774d23eeb8a642926b7a805254bbbd.png?size=512","ID":"771935774903894037"},"message":"Hey <@803409756860842055>  we are extremely sorry but we can no longer compete this order you can try and contact Jordan. But we no longer support FiveM development again we are extremely sorry.","embeds":[]},{"author":{"name":"Sin","iconURL":"https://cdn.discordapp.com/avatars/771935774903894037/a0774d23eeb8a642926b7a805254bbbd.png?size=512","ID":"771935774903894037"},"message":"Hey there hope you looked at this well I''m here to let you know this ticket will be closed  in 24 hours 😊","embeds":[]}]', 'Commissions' , 'N/A', 'PlutoTheDev#1000', 'KA$#0001', '803409756860842055', '29/4/2022 1:56:8', '346', '399718367335940117,282762192544333827,771935774903894037,803409756860842055,950157934208360558,218915906116386817,848614590903615518,333908428995035137,715707378464456755,547117107339460630,565187126019358761,886021597176148060,570211940782309377');