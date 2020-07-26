const RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'name-dp',
    descroption: 'Change a department name',
    cooldown: 5,
    args: true,
    numberArgs: 2,
    usage: '<old-department-name> <new-department-name>',
    execute(message, args, department) {
        const oldName = args[0].toLowerCase();
        const newName = args[1].toLowerCase();

        let reply = ' ';
        let newNameCount = 0;
        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            if (AlreadyExists(element, newName)) {
                newNameCount++;
            }
        }
        if (newNameCount > 0) {
            reply = `La modifica di tale nome comporterebbe avere ${newNameCount + 1} dipartimenti con lo stesso nome!`;
            message.channel.send(reply);
            return;
        }
        // Il nome del dipartimento si può modifcare
        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            if (FoundIt(element, oldName)) {
                reply = element.ChangeName(newName);
                RWHelper.WriteNewDPToFile(department);
                message.channel.send(reply);
                return;
            }

        }

        reply = 'Il dipartimento non è presente tra quelli registrati';
        message.channel.send(reply);

    },
}

//=================================== FUNCTIONS ===================================================

function FoundIt(element, oldName) {
    return element.departmentName === oldName;
}

function AlreadyExists(element, newName) {
    return element.departmentName === newName;
}


