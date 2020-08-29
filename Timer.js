const moment = require('moment');
const momentTimer = require('moment-timer');

class Timer {
    constructor(department, lastReviewDate) {
        this.department = department;
        this.timer = new moment.duration(10, 'seconds').timer({
            loop: true
        }, () => {
            console.log('Timer Ended');
        });
    }

    StartTimer() {
        if (this.timer.iStopped())
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