const Department = require("../WS/Department");
const fs = require('fs');
const RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'add-dp',
    description: 'Add a department to the team',
    cooldown: 5,
    args: true,
    usage: '<department-name>',
    execute(message, args, department) {

        department = RWHelper.FillDepartmentData(department);
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


