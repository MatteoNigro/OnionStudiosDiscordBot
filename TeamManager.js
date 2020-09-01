const fs = require('fs');
const config = require('./config.json');

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
            id: ' '
        };

        if (member.user.bot) {
            return;
        }

        singleMember.name = member.user.username;

        member.roles.cache.each(role => {
            if (role.name.startsWith(config.prefix) || role.name === config.lead)
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

function GetDepartmentLeaderID(department) {
    const team = GetJsonTeam();
    let leaders = [];
    team.forEach(member => {
        const memberRoles = GetRoles(member);
        memberRoles.forEach(r => {
            if (r === config.lead)
                leaders.push(member);
        });
    });
    let lead = '';
    leaders.forEach(leader => {
        const leaderRoles = GetRoles(leader);
        leaderRoles.forEach(r => {
            if (r == `${config.prefix}${department}`)
                lead = leader.id;
        });
    });

    return lead;
}

function GetRoles(member) {
    const memberRoles = [];
    member.roles.forEach(r => {
        memberRoles.push(r);
    });
    return memberRoles;
}


module.exports = {
    WriteTeamToFile,
    BuildTeam,
    ReadJsonTESTING,
    GetJsonTeam,
    GetDepartmentLeaderID
}