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
        // TODO: Fare controllo lower case
        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            if (element.departmentName.toString() == args) {
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