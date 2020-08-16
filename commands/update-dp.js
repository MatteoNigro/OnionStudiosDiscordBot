const TeamManager = require("../TeamManager");
const config = require('../config.json');
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

        let team = [];

        if (config.TESTING == false) {
            team = TeamManager.BuildTeam(message);
            TeamManager.WriteTeamToFile(team);
            webSocket.team = team;
        } else {
            webSocket.team = TeamManager.ReadJsonTESTING();
        }

        message.channel.send("Aggiornamento database Team completato 👌😁👌");

    }
}