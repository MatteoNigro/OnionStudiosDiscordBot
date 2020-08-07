const fs = require('fs');

const dpPrefix = '!';

function WriteTeamToFile(team) {
    if (!team)
        return console.log("You must invoke the BuildTeam function before this!");

    let data;
    try {
        data = JSON.stringify(team, null, team.length);
        fs.writeFileSync('./team.json', data);
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

function BuildTeam(message) {
    const team = [];

    message.guild.members.cache.each(member => {
        let singleMember = {
            name: ' ',
            roles: [],
            id: ' '
        };

        if (member.user.bot) {
            return;
        }

        singleMember.name = member.user.username;

        member.roles.cache.each(role => {
            if (role.name.startsWith(dpPrefix))
                singleMember.roles.push(role.name);
        });

        singleMember.id = member.user.id;

        team.push(singleMember);
    });
    return team;
}


module.exports = { WriteTeamToFile, BuildTeam }
