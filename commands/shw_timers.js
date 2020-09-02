const config = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'shw_timers',
    description: 'Mostro tutti i timer del sistema di notifica che sono attualmente attivi',
    cooldown: 5,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    guildOnly: false,
    execute(message, args, webSocket) {

        if (message.author.id != config.BIG_BOSS) {
            message.author.send(`Hey Hey ${message.author.username}, stai usando un comando che è concesso usare solamente al BIG BOSS. Siccome non hai i permessi COL CAZZO che eseguo i tuoi ordini. Fanculo! 🤗`);
            return;
        }

        const timers = webSocket.GetTimers();

        if (timers.length <= 0) {
            message.author.send(`Non ci sono timer attivi per nessun reparto`);
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Current Timers');

        timers.forEach(timer => {
            if (timer.timer.stopped)
                embed.addField(`__**${timer.department}**__`, `The timer is stopped`);
            else
                embed.addField(`__**${timer.department}**__`, `${millisecondsToHuman(timer.timer.getRemainingDuration())}`);

        });

        message.author.send(embed);
    }
}


// ======================================== FUNCTIONS =======================================================

function millisecondsToHuman(ms) {
    var seconds = ms / 1000;
    var hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    seconds = seconds % 60;

    const humanized = `${hours}:${minutes}:${seconds}`;

    return humanized;
}