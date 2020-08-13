const Discord = require("discord.js");
const TeamManager = require('../TeamManager');
const config = require('../config.json');

module.exports = {
    name: 'daily',
    desription: 'Crea una nuova daily review per il tuo dipartimento',
    cooldown: 5,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    guildOnly: true,
    execute(message, args, webSocket) {

        let team = [];

        if (config.TESTING == false) {
            team = TeamManager.BuildTeam(message);
            TeamManager.WriteTeamToFile(team);
        }


        const link = webSocket.GenerateWebLink();

        const user = message.author.username;
        webSocket.messageRef = message;

        if (config.TESTING == false) {
            webSocket.team = team;
            team.forEach(member => {
                if (member.name === user && member.roles.find(role => role === "Referente")) {
                    message.author.send("Non sei un referente, spero tu abbia una buona ragione per fare quello che stai per fare. Se non ce l'hai lascia perdere 👺");
                }
            })
        } else {
            webSocket.team = TeamManager.ReadJsonTESTING();
        }


        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Web Link')
            .setURL(link);


        message.author.send(exampleEmbed);

    }
}