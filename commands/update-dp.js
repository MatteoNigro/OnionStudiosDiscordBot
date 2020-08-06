const TeamManager = require("../TeamManager");

module.exports = {
    name: 'update-dp',
    description: 'Aggiorna lo stato dei dipartimenti e dei relativi membri',
    cooldown: 5,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    guildOnly: true,
    execute(message, args, webSocket) {

        const team = TeamManager.BuildTeam(message);

        TeamManager.WriteTeamToFile(team);

        webSocket.team = team;

        message.channel.send("Aggiornamento database Team completato 👌😁👌");

    }
}


