const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
var mysql = require('mysql');
const app = express();
const axios = require("axios");
const config = require("./config.json");
const passport = require('passport');
const session  = require('express-session');
var DiscordStrategy = require('passport-discord-faxes').Strategy;
if (Number(process.version.slice(1).split(".")[0] < 16)) throw new Error(`Node.js v16 or higher is required, Discord.JS relies on this version, please update @ https://nodejs.org`);

var multerStorage = multer.memoryStorage()
app.use(multer({ storage: multerStorage }).any());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 31556952000},
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
config.sql.charset = "utf8mb4";
let connection = mysql.createConnection(config.sql);

function loop() {
    connection.ping();
    setTimeout(() => loop(), 60000 * 30);
};

// Discord Login
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/'}), async function(req, res) {
    req.session?.loginRef ? res.redirect(req.session.loginRef) : res.redirect('/');
    delete req.session?.loginRef
});
passport.use(new DiscordStrategy({
    clientID: config.discord.oauthId,
    clientSecret: config.discord.oauthToken,
    callbackURL: `${(config.domain.endsWith('/') ? config.domain.slice(0, -1) : config.domain)}/auth/discord/callback`,
    scope: ['identify', 'guilds', 'email'],
    prompt: 'consent'
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));


app.listen(config.port, function() { console.log(`Listening on port ${config.port}`) });

app.get('/', async function(req, res) {
    res.redirect(`https://plutos.world/error?err=API Index page not found.`);
});
app.get("/viewlinks/:guild", async function(req, res) {
    connection.query(`SELECT * FROM links WHERE guild = '${req.params.guild}';`, function(err, response) {
        res.json((response?.length) ? response[0].links.split(",,,") : ["No data found."]);
    });
});
app.get("/viewterms/:guild", async function(req, res) {
    connection.query(`SELECT * FROM links WHERE guild = '${req.params.guild}';`, function(err, response) {
        res.json((response?.length) ? response[0].terms.split(",,,") : ["No data found."]);
    });
});

app.post("/updatelinks/:guild", async function(req, res) {
    let guild = req.params.guild.replace("'", "''");
    let links = req?.query?.links.replaceAll("'", "''");
    if (!links) return res.send(false);
    connection.query(`SELECT * FROM links WHERE guild = '${guild}';`, function(err, response) {
        if (!response?.length) {
            connection.query(`INSERT INTO links (guild, links, terms) VALUES ('${guild}', '${links}', '');`, (err, good) => {if (err) throw err;});
            return res.send(true);
        } else {
            connection.query(`UPDATE links SET links = '${links}' WHERE guild = '${guild}';`, () => {});
            return res.send(true);
        }
    });
});

app.post("/updateterms/:guild", async function(req, res) {
    let guild = req.params.guild.replace("'", "''");
    let terms = req?.query?.terms.replaceAll("'", "''");
    if (!links) return res.send(false);
    connection.query(`SELECT * FROM links WHERE guild = '${guild}';`, function(err, response) {
        if (!response?.length) {
            connection.query(`INSERT INTO links (guild, links, terms) VALUES ('${guild}', '', '${terms}');`, (err, good) => {if (err) throw err;});
            return res.send(true);
        } else {
            connection.query(`UPDATE links SET terms = '${terms}' WHERE guild = '${guild}';`, () => {});
            return res.send(true);
        }
    });
});

app.post("/updateall/:guild", async function(req, res) {
    let guild = req.params.guild.replace("'", "''");
    let terms = req?.query?.terms;
    let links = req?.query?.links;
    if (!links || !terms) return res.send(false);
    connection.query(`SELECT * FROM links WHERE guild = '${guild}';`, function(err, response) {
        if (!response?.length) {
            connection.query(`INSERT INTO links (guild, links, terms) VALUES ('${guild}', '${links}', '${terms}');`, (err, good) => {if (err) throw err;});
            return res.send(true);
        } else {
            connection.query(`UPDATE links SET terms = '${terms}', links = '${links}' WHERE guild = '${guild}';`, () => {});
            return res.send(true);
        }
    });
});

app.post("/uploadTicket/:guild", async function(req, res) {
    let auth = req.headers.authorization;
    if (auth !== "0cor1A1EIZbMXIRMwyjnLXJ-fUaICv2U") return res.send(false);
    let guild = req.params.guild.replace("'", "''");
    let data = req?.query?.data;
    let questions = req?.query?.questions;
    if (!guild || !data) return res.send(false);
    data = JSON.parse(data, "utf-8");
    let permUsers = req.query.permUsers || "";
    connection.query(`INSERT INTO tickets (guild, panel, claimedBy, closedBy, openedBy, openerId, dateClosed, ticketID, users) VALUES ('${guild}', '${data.panel}' , '${data.claimedBy}', '${data.closedBy}', '${data.openedBy}', '${data.openerId}', '${data.dateClosed}', '${data.ticketID}', '${permUsers}');`, (err, result) => {
        res.send(String(result.insertId));
        connection.query(`UPDATE tickets SET data = ?, questions = ? WHERE id = ${result.insertId}`, [JSON.stringify(data.data), JSON.stringify(questions)], function(err, res) {if (err) console.log(err.stack)});
    });
});

app.get("/ticket/:id", async function(req, res) {
    let id = req.params.id;
    if(!id) return res.send(false);
    if(req.isAuthenticated()) {
        connection.query(`SELECT * FROM tickets WHERE id = ${Number(id)};`, function(err, result) {
            connection.query(`SELECT * FROM users;`, async function(err, foundUsers) {
                if(!result[0].users.split(',').includes(req.user.id)) return res.redirect(`https://plutos.world/error?err=You don't have access to view this page.`)
                result[0].data = JSON.parse(result[0].data, "utf-8");
                let userData = {};
                for (let user of foundUsers) {
                    userData[user.user] = {
                        username: user.username,
                        tag: user.tag,
                        iconURL: user.icon
                    };
                };
                let questions = []
                if (result[0].questions != null) questions = JSON.parse(result[0].questions);
                if (result.length) res.render("viewticket", { data: result[0], config: config, users: userData, questions: questions });
            });
        });
    } else {
        req.session.loginRef = req.path;
        res.redirect('/auth/discord');
    }
});

app.post("/uploadTranscript/:guild", async function(req, res) {
    let auth = req.headers.authorization;
    if (auth !== "0cor1A1EIZbMXIRMwyjnLXJ-fUaICv2U") return res.send(false);
    let guild = req.params.guild.replace("'", "''");
    let data = req?.query?.data;
    if (!guild || !data) return res.send(false);
    data = JSON.parse(data, "utf-8");
    let permUsers = req.query.permUsers || "";
    connection.query(`INSERT INTO transcripts (guild, panel, archivedBy, openedBy, ticketID, dateArchived, users) VALUES ('${guild}', '${data.panel}' , '${data.archivedBy}', '${data.openedBy}', '${data.ticketID}', '${data.dateArchived}', '${permUsers}');`, (err, result) => {
        if (err) throw err;
        res.send(String(result.insertId));
        connection.query(`UPDATE transcripts SET data = ? WHERE id = ${result.insertId}`, [JSON.stringify(data.data)], function(err, res) {});
    });
});

app.get("/archive/:id", async function(req, res) {
    let id = req.params.id;
    if(!id) return res.send(false);
    if (req.isAuthenticated()) {
        connection.query(`SELECT * FROM transcripts WHERE id = ${Number(id)};`, function(err, result) {
            connection.query(`SELECT * FROM users;`, function(err, foundUsers) {
                if(!result[0].users.split(',').includes(req.user.id)) return res.redirect(`https://plutos.world/error?err=You don't have access to view this page.`)
                result[0].data = JSON.parse(result[0].data, "utf-8");
                let userData = {};
                for (let user of foundUsers) {
                    userData[user.user] = {
                        username: user.username,
                        tag: user.tag,
                        iconURL: user.icon
                    };
                };
                if (result.length) res.render("viewtranscript", { data: result[0], config: config, users: userData });
            })
        });
    } else {
        req.session.loginRef = req.path;
        res.redirect('/auth/discord');
    }
});

app.post("/uploadApplication/:guild", async function(req, res) {
    let auth = req.headers.authorization;
    if (auth !== "0cor1A1EIZbMXIRMwyjnLXJ-fUaICv2U") return res.send(false);
    let guild = req.params.guild.replace("'", "''");
    let data = req?.query?.data;
    if (!guild || !data) return res.send(false);
    data = JSON.parse(data, "utf-8");
    let mySqldata = {
        questions: data.questions,
        answers: data.answers
    };
    connection.query(`INSERT INTO applications (guild, users, data, panel, applicant, timeTaken, dateSubmitted, applicationID, applicantID) VALUES ('${guild}', '${req.query.users}', '${JSON.stringify(mySqldata)}', '${data.panel}', '${data.applicant}', '${data.timeTaken}', '${data.dateSubmitted}', '${data.applicationID}', '${data.applicantID}');`, (err, result) => {
        res.send(String(result.insertId));
    });
});

app.get("/application/:id", async function(req, res) {
    let id = req.params.id;
    if (!id) return res.send(false);
    if (req.isAuthenticated()) {
        connection.query(`SELECT * FROM applications WHERE id = ${Number(id)};`, function(err, result) {
            if(!result[0].users.split(',').includes(req.user.id)) return res.redirect(`https://plutos.world/error?err=You don't have access to view this page.`)
            result[0].data = JSON.parse(result[0].data, "utf-8");
            if (result.length) res.render("viewapplication", { data: result[0], config: config })
        });
    } else {
        req.session.loginRef = req.path;
        res.redirect('/auth/discord');
    }
});

app.post("/uploadPrune/:guild", async function(req, res) {
    let auth = req.headers.authorization;
    if (auth !== "0cor1A1EIZbMXIRMwyjnLXJ-fUaICv2U") return res.send(false);
    let guild = req.params.guild.replace("'", "''");
    let data = req?.query?.data;
    if (!guild || !data) return res.send(false);
    data = JSON.parse(data, "utf-8");
    connection.query(`INSERT INTO prunes (guild, data, dateClosed, prunedBy, users) VALUES ('${guild}', '${JSON.stringify(data.data)}', '${data.dateClosed}', '${data.prunedBy}', '${req.query.permUsers}');`, (err, result) => {
        res.send(String(result.insertId));
    });
});

app.get("/prune/:id", async function(req, res) {
    let id = req.params.id;
    if (!id) return res.send(false);
    if(req.isAuthenticated()) {
        connection.query(`SELECT * FROM prunes WHERE id = ${Number(id)};`, function(err, result) {
            connection.query(`SELECT * FROM users;`, function(err, foundUsers) {
                if(!result[0].users.split(',').includes(req.user.id)) return res.redirect(`https://plutos.world/error?err=You don't have access to view this page.`)
                result[0].data = JSON.parse(result[0].data, "utf-8");
                let userData = {};
                for (let user of foundUsers) {
                    userData[user.user] = {
                        username: user.username,
                        tag: user.tag,
                        iconURL: user.icon
                    };
                };
                if (result.length) res.render("viewprune", { data: result[0], config: config, users: userData })
            });
        });
    } else {
        req.session.loginRef = req.path;
        res.redirect('/auth/discord');
    }
});

app.post("/sendUsers", async function(req, res) {
    let users;
    try {users = JSON.parse(req.query.users, "utf-8");} catch {};
    if (!users) return res.send(false);
    res.send(true);
    for (let user of users) {
        connection.query(`SELECT * FROM users WHERE user = '${user.id}';`, function(err, result) {
            if (!result?.length) {
                connection.query(`INSERT INTO users (user, username, tag, icon) VALUES ('${user.id}', '${user.username}', '${user.tag}', '${user.icon}');`, () => {});
            } else {
                if (result[0].username !== user.username || result[0].tag !== user.tag || result[0].icon !== user.icon) {
                    connection.query(`UPDATE users SET username = '${user.username}', tag = '${user.tag}', icon = '${user.icon}' WHERE id = ${result[0].id};`, () => {});
                }
            }
        });
    };
});

process.on("uncaughtException", (err) => {console.log(err.stack)});