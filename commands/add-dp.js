const Department = require("../WS/Department");

module.exports = {
    name: 'add-dp',
    description: 'Add a department to the list',
    cooldown: 5,
    args: true,
    usage: '<department-name>',
    add: true,
    execute(message, args, department) {

        let reply = ' ';
        for (let i = 0; i < department.length; i++) {
            const element = department[i].departmentName.toString().toLowerCase();
            const arg = args.shift().toLowerCase();
            if (element == arg) {
                reply = `Il dipartimento ${args} esiste già`;
                message.channel.send(reply);
                return;
            }

        }

        let dp = new Department(args);
        reply = `Il dipartimento ${dp.departmentName} è stato creato`;
        message.channel.send(reply);
        return dp;
    },
}