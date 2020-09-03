const Discord = require("discord.js");
const TeamManager = require('../TeamManager');
const config = require('../config.json');
const ReviewChannelManager = require('../ReviewChannelManager');

module.exports = {
    name: 'daily',
    description: 'Crea una nuova daily review per il tuo dipartimento',
    cooldown: 5,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    guildOnly: true,
    execute(message, args, webSocket) {
        webSocket.modifier = false;

        const mod = args.shift();
        if (mod && mod != 'mod') {
            message.author.send(`Che cazzo scrivi parole a caso?! L'argomento ${mod} non significa una sega, forse intendevi "mod". COGLIONE!!! 💩💩💩`);
            return;
        }

        if (mod && mod === 'mod')
            webSocket.modifier = true;

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
                if (member.name === user && !member.roles.find(role => role === config.lead)) {
                    message.author.send("Non sei un referente, spero tu abbia una buona ragione per fare quello che stai per fare. Se non ce l'hai lascia perdere 👺");
                }
            });
        } else {
            webSocket.team = TeamManager.ReadJsonTESTING();
        }

        const channels = ReviewChannelManager.GetReviewChannelID(webSocket, message);
        webSocket.reviewChannelID = channels.shift();

        let title = 'Create New Daily Review';

        if (webSocket.modifier) {
            title = 'Modify Old Daily Review';
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            .setURL(link)
            .addField('🖕🖕 Clicca sul link qui sopra 🖕🖕', '\u200B');


        message.author.send(embed);

    }
}