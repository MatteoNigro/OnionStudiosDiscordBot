const Discord = require("discord.js");

module.exports = {
    name: 'shw-dp',
    description: 'Mostra tutti i dipartimenti con i relativi membri',
    cooldown: 2,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    execute(message, args, department) {
        let reply = ' ';
        if (NoDepartments(department)) {
            reply = 'Non ci sono dipartimenti registrati';
            message.channel.send(reply);
            return;
        }

        let embed = new Discord.MessageEmbed().setColor(0x0099ff);

        PopulateEmbed(department, embed);

        message.channel.send(embed);
    }

}

//==================================== FUNCTIONS =================================================================

function PopulateEmbed(department, embed) {
    for (let i = 0; i < department.length; i++) {
        const element = department[i];

        const departmentName = element.departmentName.toUpperCase().toString();
        const memberNames = element.GetMembers();
        embed.addField(departmentName, memberNames, true);
    }
}

function NoDepartments(department) {
    return department.length === 0;
}
