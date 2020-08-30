const fs = require('fs');
const config = require('./config.json');

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

function GetDepartmentLeader(department) {
    const team = GetJsonTeam();
    let leaders = [];
    team.forEach(member => {
        const memberRoles = GetRoles(member);
        memberRoles.forEach(r => {
            if (r === `${dpPrefix}Referente`)
                leaders.push(member);
        });
    });
    const lead = '';
    leaders.forEach(leader => {
        const leaderRoles = GetRoles(leader);
        leaderRoles.forEach(r => {
            if (r == `${config.prefix}${department}`)
                lead = leader.name;
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
    GetDepartmentLeader
}