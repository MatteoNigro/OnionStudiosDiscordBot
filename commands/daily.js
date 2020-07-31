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
    execute(message, args, department, client) {


        let rndToken = Math.random() * 10;
        console.log(rndToken);

        let webSocket = new WebSocket(`${rndToken}`, 5665, client);
        let webSockest = new WebSocket(`${rndToken}`, 5666, client);


        webSocket.OpenConnection();
        //webSockest.OpenConnection();

        const link = webSocket.GenerateWebLink();

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Web Link')
            .setURL(link);

        message.channel.send(exampleEmbed);

    }
}

