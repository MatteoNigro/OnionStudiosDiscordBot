const Discord = require("discord.js");
const WebSocket = require('../WS/WebSocket');

module.exports = {
    name: 'daily',
    desription: 'Crea una nuova daily review',
    cooldown: 5,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    execute(message, args, department, link) {

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Web Link')
            .setURL(link);

        message.channel.send(exampleEmbed);

    }
}

