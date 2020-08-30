const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const Discord = require("discord.js");
const TeamManager = require('../TeamManager');
const ReviewDatesManager = require('../ReviewDatesManager');
const moment = require('moment');
const momentTimer = require('moment-timer');
const Timer = require('../Timer');


class WebSocket {
    constructor(token, port, client) {
        this.token = token;
        this.client = client;
        this.port = port;

        this.messageRef;
        this.team;
        this.reviewChannelID;
        this.timers = [];

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
                    let memberRoles = this.GetDepartmentRoles(member);

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
                    errtype: '😱😱 DEPARMENT PARAMETERS ARE NOT CORRECT 😱😱'
                });
                return;
            }

            this.team.forEach(member => {
                let roles = this.GetDepartmentRoles(member);

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

        this.app.get('/sendReview', (req, res) => {
            res.render('sendReview', {
                title: 'Review Completed'
            });
        });

        this.app.post('/sendReview', (req, res) => {

            const user = this.messageRef.author.username;
            const reviewChannel = this.client.guilds.cache.first().channels.cache.get(this.reviewChannelID);
            if (!reviewChannel) {
                this.messageRef.author.send(`📛📛 C'è un problema riguardo alla reference con il canale in cui vengono fatte le daily review. Contattare subito l'assistenza! 📛📛`);
                return;
            }
            let reviewAlreadyDone = false;

            let department;
            this.team.forEach(member => {
                if (user === member.name) {
                    let roles = this.GetDepartmentRoles(member);
                    department = roles.shift().slice(1);
                }
            });

            // YYY/MM/DD
            const date = moment(req.body.reviewDate)
            const today = moment();

            if (date.isAfter(today)) {
                this.messageRef.author.send(`Stai cercando di fare una review per un giorno successivo ad oggi. Non ha il minimo senso logico.`);
                return;
            }

            // TODO: Prendere quello che è stato scritto nella review e ricaricare la pagina con quelle info come risposta per evitare il caricamento infinito.

            // DD/MM/YYY
            let reviewDate = date.format("DD[/]MM[/]YYYY");

            const reviewDates = ReviewDatesManager.GetWrittenReviewDates();
            reviewDates.forEach(obj => {
                if (reviewDate === obj.date && department === obj.department) {
                    reviewAlreadyDone = true;
                    this.messageRef.author.send(`La daily review in data ${obj.date} è già stata effettuata`);
                    return;
                }
            });

            if (reviewAlreadyDone)
                return;

            const dailyReviewElement = {
                date: reviewDate,
                department: department
            };


            ReviewDatesManager.WriteOneDateReviewToFile(dailyReviewElement);

            let webPageData = this.GetWebPageBodyReview(req);

            const embed = new Discord.MessageEmbed()
                .setTitle(`Daily Review: ${dailyReviewElement.department} [${dailyReviewElement.date}]`);

            webPageData.forEach(memberData => {
                embed.addField('\u200B', `__**${memberData.name}**__`)
                    .addField('* Ultime 24 ore: ', memberData.last24)
                    .addField('* Prossime 24 ore: ', memberData.next24)
                    .addField('* Problematiche: ', memberData.issue);
            });
            embed.setTimestamp().setFooter(`Creata da: ${user}`);


            if (reviewChannel)
                reviewChannel.send(embed);


            // Notification System Started




            // TODO: Created an array of timers to store them for each department, i have to create the validation for which the timer stop when a certain amount of time is passed. Every time a member makes a daily review a personal timer starts checking if the date of the review is equal to the moment now plus a day at eleven o'clock in the evening. Also every time a review is completed a check on the timers variable is made to assure that there are not multiple instances of the same timer for the same department. 

            // CHeck error on daily.js for !Referente roles cause that check doesn't work.

            // P.S. Avoid all this timer thing when a member is modifying an old review with a flag or something like that

            let timer = new Timer(dailyReviewElement.department, dailyReviewElement.date, this.client);

            this.timers.push(timer);





            res.redirect('/sendReview');

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

    GetDepartmentRoles(member) {
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