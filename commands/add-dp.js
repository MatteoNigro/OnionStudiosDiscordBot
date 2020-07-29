const Department = require("../WS/Department");
const RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'add-dp',
    description: 'Aggiunge un dipartimento al team',
    cooldown: 5,
    args: true,
    minArgs: 1,
    multipleInput: false,
    usage: '<department-name>',
    execute(message, args, department) {

        const arg = args.shift().toLowerCase();

        let reply = ' ';
        for (let i = 0; i < department.length; i++) {
            const element = department[i].departmentName.toString().toLowerCase();
            if (AlreadyExist(element, arg)) {
                reply = `Il dipartimento ${arg} esiste già`;
                message.channel.send(reply);
                return;
            }
        }

        let createdDP = new Department(arg);
        department.push(createdDP);

        const error = RWHelper.WriteNewDPToFile(department);

        if (!error) {
            reply = `Il dipartimento ${createdDP.departmentName} è stato creato`;
            message.channel.send(reply);
        }
    },
}

//=================================== FUNCTIONS ===================================================

function AlreadyExist(element, arg) {
    return element == arg;
}


