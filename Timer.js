const moment = require('moment');
const momentTimer = require('moment-timer');
const TeamManager = require('./TeamManager');
const config = require('./config.json');

class Timer {
    constructor(department, lastReviewDate, client) {
        this.department = department;
        this.timer = new moment.duration(10, 'seconds').timer({
            start: true,
            loop: true
        }, () => {
            const now = moment();
            const reviewDate = moment(lastReviewDate.split('/').reverse().join('-'));
            console.log('NOW --> ' + now.toString());
            console.log('REVIEW DATE --> ' + reviewDate.toString());

            if (now.isAfter(reviewDate.hour(23).minutes(0).seconds(0).add(1, 'day'))) {
                const leadMemberID = TeamManager.GetDepartmentLeader(department);

                if (!leadMemberID) {
                    const admin = client.users.cache.get(config.BIG_BOSS);
                    admin.send(`No one of the members of the ${department} department is signed as leader!`);
                    return;
                }
                console.log(leadMemberID);

                client.guilds.cache.array.forEach(guild => {
                    guild.members.cache.array.forEach(member => {
                        if (member.id === leadMemberID); {
                            member.send(`Sei in ritardo per la review di oggi ${reviewDate}!!! 🤬🤬`);
                            console.log(member);
                            return;
                        }
                    })
                });
            }
        });
    }

    StartTimer() {
        if (this.timer.isStopped())
            this.timer.start();
        else
            console.log(`The ${this.department} timer is already running`);
    }

    StopTimer() {
        if (this.timer.isStarted())
            this.timer.stop();
        else
            console.log(`The ${this.department} timer is already stopped`);
    }

}


module.exports = Timer;