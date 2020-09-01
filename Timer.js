const moment = require('moment');
const momentTimer = require('moment-timer');
const TeamManager = require('./TeamManager');
const config = require('./config.json');

class Timer {
    constructor(department, lastReviewDate, client, team) {
        this.department = department;
        this.timer = new moment.duration(10, 'seconds').timer({
            start: true,
            loop: true
        }, () => {
            const now = moment();
            const reviewDate = moment(lastReviewDate.split('/').reverse().join('-'));

            if (now.isAfter(reviewDate.hour(22).minutes(0).seconds(0).add(1, 'day'))) {
                const admin = client.users.cache.get(config.BIG_BOSS);

                const leadMemberID = TeamManager.GetDepartmentLeaderID(department);

                if (!leadMemberID) {
                    admin.send(`No one of the members of the ${department} department is signed as leader!`);
                    return;
                }

                let memberToNotifyID;
                team.forEach(member => {
                    if (member.id === leadMemberID)
                        memberToNotifyID = member.id;
                });

                if (!memberToNotifyID)
                    admin.send(`There is a problem with the writing process of the team json file`);

                const memberToNotify = client.users.cache.get(memberToNotifyID);
                memberToNotify.send(`Sei in ritardo per la review di oggi ${reviewDate.format("DD[/]MM[/]YYYY")}!!! 🤬🤬`);
            }

            if (now.isAfter(reviewDate.add(2, 'days'), 'day'))
                this.StopTimer();

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