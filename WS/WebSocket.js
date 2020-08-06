const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

class WebSocket {
    constructor(token, port, client) {
        this.token = token;
        this.client = client;
        this.port = port;
        this.department;

        var hbs = exphbs.create({
            extname: 'hbs',
            defaultLayout: 'layout',
            layoutsDir: path.join(__dirname, 'views/layouts'),

            // custom helpers
            helpers: {
                ifmatch: function (value1, value2) {
                    return value1 === value2;
                },
                ifEquals: function (arg1, arg2, options) {
                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                }
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

            const dropDownDeps = this.GetDepartmentNames();

            let frontEndDep = {
                members: [{
                    name: " ",
                    "job": " "
                }],
                departments: [{
                    name: " "
                }]
            };
            /*
                        for (let i = 0; i < this.department.length; i++) {
                            const dep = this.department[i];
                            const membersArray = Array.from(dep.members);
                            console.log(membersArray);
                            for (let j = 0; j < membersArray.length; j++) {
                                const memb = membersArray[j];
                                console.log(memb);
                                frontEndDep.members[j].name = memb;
                            }
            
                        }
            
            
                        //console.log(frontEndDep);
            
            */





            res.render('index', {
                title: 'discorBot Web Interface',
                token: _token,
                chans,
                departments: dropDownDeps,
                dep: ["Design", "Programming"],
                members: [
                    {
                        name: "Riccardo",
                        job: "Programming"
                    },
                    {
                        name: "Matteo",
                        job: "Design"
                    }
                ]
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


    GetDepartmentNames() {
        let deps = [];
        for (let i = 0; i < this.department.length; i++) {
            const element = this.department[i];
            deps[i] = this.CapitalizeFirstLetter(element.departmentName);
        }
        return deps;
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

    SendDepartmentData(dep) {
        this.department = dep;
    }

    CapitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


}

module.exports = WebSocket;