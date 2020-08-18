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

function GetWrittenReviewDates() {
    let actualDates = [];
    try {
        const stringDates = fs.readFileSync('./reviews.json');
        if (!isEmpty(stringDates))
            actualDates = JSON.parse(stringDates);
    } catch (error) {
        console.log(error);
        return;
    }
    return actualDates;
}

function WriteDateReviewToFile(reviewDate) {
    if (!reviewDate)
        return console.log('C\'è un problema con il reperimento della data dal front end');

    let allDates = [];
    allDates = GetWrittenReviewDates();
    allDates.push(reviewDate);

    try {
        const data = JSON.stringify(allDates, null);
        fs.writeFileSync('./reviews.json', data);
    } catch (error) {
        console.log(error);
        return;
    }
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

function isEmpty(obj) {
    return !Object.keys(obj).length;
}


module.exports = {
    WriteTeamToFile,
    BuildTeam,
    ReadJsonTESTING,
    GetWrittenReviewDates,
    WriteDateReviewToFile
}