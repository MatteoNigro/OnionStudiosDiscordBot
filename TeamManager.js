const fs = require('fs');

const dpPrefix = '!';

function WriteTeamToFile(team) {
    if (!team)
        return console.log("You must invoke the BuildTeam function before this!");

    let data;
    try {
        data = JSON.stringify(team, null, team.length);
        fs.writeFileSync('./team.json', data);
    } catch (error) {
        console.error(error);
        return;
    }
}

function BuildTeam(message) {
    const team = [];

    message.guild.members.cache.each(member => {
        let singleMember = {
            name: ' ',
            roles: [],
            id: ' ',
            lastReviewDate: ' '
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

function GetJsonTeam() {
    let team;
    try {
        const teamString = fs.readFileSync('./team.json');
        team = JSON.parse(teamString);
    } catch (error) {
        console.log(error);
        return error;
    }
    return team;
}

function ReadJsonTESTING() {
    let team;
    try {
        const teamString = fs.readFileSync('./TESTteam.json');
        team = JSON.parse(teamString);
    } catch (error) {
        console.log(error);
        return error;
    }
    return team;

}


module.exports = {
    WriteTeamToFile,
    BuildTeam,
    ReadJsonTESTING,
    GetJsonTeam
}