const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const Discord = require("discord.js");
const TeamManager = require('../TeamManager');

class WebSocket {
    constructor(token, port, client) {
        this.token = token;
        this.client = client;
        this.port = port;

        this.messageRef;
        this.team;
        this.reviewChannelID;

        var hbs = exphbs.create({
            extname: 'hbs',
            defaultLayout: 'layout',
            layoutsDir: path.join(__dirname, 'views/layouts'),

            // custom helpers
            helpers: {

            }
        });

        this.app = express();
        this.app.engine('hbs', hbs.engine);

        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'hbs');

        this.app.use(express.static(path.join(__dirname, 'public')));

        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());

        this.RegisterRoots();

        this.OpenConnection();

    }

    OpenConnection() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Websocket listening on port ${this.server.address().port}`);
        });
    }

    checkToken(_token) {
        return (_token == this.token);
    }

    RegisterRoots() {
        // http://localhost:port?token=123456
        this.app.get('/', (req, res) => {
            var _token = req.query.token;
            if (!this.checkToken(_token)) {
                res.render('error', {
                    title: 'ERROR',
                    errtype: 'INVALID TOKEN'
                });
                return;
            }

            if (!this.messageRef)
                return;


            let discordRolesProblems = false;
            const user = this.messageRef.author.username;
            let dp = ' ';
            let members = [];

            if (!user) {
                this.messageRef.author.send('Lo user nel WebSocket non è definito, riferire all\'amministratore di sistema');
                return;
            }

            this.team.forEach(member => {
                if (user === member.name) {
                    let memberRoles = this.GetRoles(member);

                    if (!memberRoles.length) {
                        discordRolesProblems = true;
                        this.messageRef.author.send("L'utente che sta cercando di effettuare la review non fa parte di nessun dipartimento, oppure il nome del ruolo non possiede il prefisso necessario");
                        return;
                    }
                    if (memberRoles.length > 1) {
                        discordRolesProblems = true;
                        this.messageRef.author.send("L'utente che sta cercando di effettuare la review risiede in più di un dipartimento! Sistemare i ruoli prima di continuare");
                        return;
                    }

                    dp = memberRoles.shift().slice(1);
                }
            });

            if (discordRolesProblems) {
                res.render('error', {
                    title: 'ERROR',
                    errtype: 'DEPARMENT PARAMETERS ARE NOT CORRECT'
                });
                return;
            }

            this.team.forEach(member => {
                let roles = this.GetRoles(member);

                if (!roles.length) {
                    discordRolesProblems = true;
                    this.messageRef.author.send(`Il membro ${member.name} non appartiene a nessun reparto controllare e sistemare prima di procedere`);
                    return;
                }
                if (roles.length > 1) {
                    discordRolesProblems = true;
                    this.messageRef.author.send(`Il membro ${member.name} risiede in più dipartimenti contemporaneamente! Sistemare i ruoli prima di procedere`);
                    return;
                }

                if (roles.shift() === `!${dp}`)
                    members.push(member.name);

            });
            this.members = members;

            if (discordRolesProblems) {
                res.render('error', {
                    title: 'ERROR',
                    errtype: 'DEPARTMENT PARAMETERS ARE NOT CORRECT'
                });
                return;
            }

            res.render('index', {
                title: 'discorBot Web Interface',
                token: _token,
                department: dp,
                members: members,
            });

        });


        this.app.post('/sendReview', (req, res) => {

            const user = this.messageRef.author.username;
            const reviewChannel = this.client.guilds.cache.first().channels.cache.get(this.reviewChannelID);
            let reviewAlreadyDone = false;

            let department;
            this.team.forEach(member => {
                if (user === member.name) {
                    let roles = this.GetRoles(member);
                    department = roles.shift().slice(1);
                }
            });

            let reviewDate = req.body.reviewDate.split('-').reverse().join('/');

            const reviewDates = TeamManager.GetWrittenReviewDates();
            reviewDates.forEach(date => {
                if (reviewDate === date) {
                    reviewAlreadyDone = true;
                    this.messageRef.author.send(`La daily review in data ${date} è già stata effettuata`);
                    return;
                }
            });

            if (reviewAlreadyDone)
                return;

            TeamManager.WriteDateReviewToFile(reviewDate);


            let webPageData = this.GetWebPageBodyReview(req);

            const embed = new Discord.MessageEmbed()
                .setTitle(`Daily Review: ${department} [${reviewDate}]`);

            webPageData.forEach(memberData => {
                embed.addField('\u200B', `__**${memberData.name}**__`)
                    .addField('* Ultime 24 ore: ', memberData.last24)
                    .addField('* Prossime 24 ore: ', memberData.next24)
                    .addField('* Problematiche: ', memberData.issue);
            });
            embed.setTimestamp().setFooter(`Creata da: ${user}`);


            if (reviewChannel)
                reviewChannel.send(embed);

        });
    }


    GetWebPageBodyReview(req) {
        let data = [];
        for (let i = 0; i < this.members.length; i++) {
            const member = this.members[i];
            const memberData = {
                name: '',
                last24: '',
                next24: '',
                issue: ''
            };

            memberData.name = member;
            memberData.last24 = req.body['last24Area' + i];
            memberData.next24 = req.body['next24Area' + i];
            memberData.issue = req.body['issueArea' + i];

            data.push(memberData);
        }
        return data;
    }

    GetRoles(member) {
        const memberRoles = [];
        member.roles.forEach(r => {
            if (r.startsWith('!')) {
                memberRoles.push(r);
            }
        });
        return memberRoles;
    }

    GenerateWebLink() {
        const base = 'http://localhost';
        const port = this.port;
        const token = this.token;
        const link = `${base}:${port}?token=${token}`;
        return link;
    }

}

module.exports = WebSocket;