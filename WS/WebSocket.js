const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const { Message } = require('discord.js');

class WebSocket {
    constructor(token, port, client) {
        this.token = token;
        this.client = client;
        this.port = port;

        this.messageRef;
        this.team;

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

        this.app.use(bodyParser.urlencoded({ extended: false }));
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
                res.render('error', { title: 'ERROR', errtype: 'INVALID TOKEN' });
                return;
            }

            var chans = this.GetAllTextChannels();

            if (!this.messageRef)
                return;


            let error = false;
            const user = this.messageRef.author.username;
            let dp = ' ';
            let members = [];

            if (!user) {
                this.messageRef.author.send('Lo user nel WebSocket non è definito, riferire all\'amministratore di sistema');
                return;
            }

            this.team.forEach(member => {
                if (user === member.name) {
                    const memberRoles = [];
                    member.roles.forEach(r => {
                        if (r.startsWith('!')) {
                            memberRoles.push(r);
                        }
                    });

                    if (!memberRoles.length) {
                        error = true;
                        this.messageRef.author.send("L'utente che sta cercando di effettuare la review non fa parte di nessun dipartimento, oppure il nome del ruolo non possiede il prefisso necessario");
                        return;
                    }
                    if (memberRoles.length > 1) {
                        error = true;
                        this.messageRef.author.send("L'utente che sta cercando di effettuare la review risiede in più di un dipartimento! Sistemare i ruoli prima di continuare");
                        return;
                    }

                    dp = memberRoles.shift().slice(1);
                }
            });

            if (error) {
                res.render('error', { title: 'ERROR', errtype: 'DEPARMENT PARAMETERS ARE NOT CORRECT' });
                return;
            }

            this.team.forEach(member => {
                let roles = [];
                member.roles.forEach(r => {
                    if (r.startsWith('!'))
                        roles.push(r);
                })

                if (!roles.length) {
                    error = true;
                    this.messageRef.author.send(`Il membro ${member.name} non appartiene a nessun reparto controllare e sistemare prima di procedere`);
                    return;
                }
                if (roles.length > 1) {
                    error = true;
                    this.messageRef.author.send(`Il membro ${member.name} risiede in più dipartimenti contemporaneamente! Sistemare i ruoli prima di procedere`);
                    return;
                }

                if (roles.shift() === `!${dp}`)
                    members.push(member.name);

            });

            if (error) {
                res.render('error', { title: 'ERROR', errtype: 'DEPARMENT PARAMETERS ARE NOT CORRECT' });
                return;
            }

            res.render('index', {
                title: 'discorBot Web Interface',
                token: _token,
                chans,
                derpartment: dp,
                members

            });

        });

        // Other stuff

        this.app.post('/sendMessage', (req, res) => {
            var _token = req.body.token;
            var text = req.body.text;
            var channelid = req.body.channelid;

            if (!this.checkToken(_token))
                return;

            var chan = this.client.guilds.cache.first().channels.cache.get(channelid);

            if (chan) {
                chan.send(text);
            }
        });
    }


    GetAllTextChannels() {
        var chans = [];
        this.client.guilds.cache.first().channels.cache
            .filter(c => c.type == 'text')
            .forEach(c => {
                chans.push({ id: c.id, name: c.name });
            });
        return chans;
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