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
            });
        } else {
            webSocket.team = TeamManager.ReadJsonTESTING();
        }

        var channels = [];
        webSocket.client.guilds.cache.first().channels.cache
            .filter(c => c.type == 'text' && c.name == config.defaultChannel)
            .forEach(c => {
                channels.push(c.id);
            });

        if (!channels)
            return message.author.send(`Non sono presenti canali testuali con il nome ${config.defaultChannel}! Sistema o, se non puoi, contatta subito chi ha i permessi per farlo`);

        if (channels.length > 1)
            return message.author.send(`Ci sono multipli canali testuali con il nome ${config.defaultChannel}! Sistema o, se non puoi, contatta subito chi ha i permessi per farlo`);

        webSocket.reviewChannelID = channels.shift();


        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Web Link')
            .setURL(link);


        message.author.send(embed);

    }
}