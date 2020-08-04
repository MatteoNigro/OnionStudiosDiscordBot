const RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'add-mb',
    description: 'Aggiunge uno o più nuovi membri ad un dipartimento',
    cooldown: 5,
    args: true,
    minArgs: 2,
    multipleInput: true,
    usage: '<department-name> <member-name> <...>',
    execute(message, args, department, link) {
        const departmentArg = args.shift().toLowerCase();
        let dep;
        let reply = ' ';

        dep = CheckDepartmentExistence(department, departmentArg, dep);

        if (!dep) {
            reply = 'Il primo argomento DEVE essere il nome di un dipartimeto esistente!';
            message.channel.send(reply);
            return;
        }

        let membersArgs = [];

        membersArgs = RetrieveArguments(args, membersArgs);


        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            if (DepartmentFound(element, departmentArg)) {
                SendAdditionMessage(membersArgs, reply, element, message);
            }
        }

        RWHelper.WriteNewDPToFile(department);



    }
}

//=================================================== FUNCTIONS =========================================================================

function SendAdditionMessage(members, reply, element, message) {
    members.forEach(mb => {
        reply = element.AddMember(mb);
        message.channel.send(reply);
    });
}

function DepartmentFound(element, departmentArg) {
    return element.departmentName.toString().toLowerCase() === departmentArg;
}

function RetrieveArguments(args, members) {
    for (let i = 0; i < args.length; i++) {
        members.push(args[i]);
    }
    return members;
}

function CheckDepartmentExistence(department, departmentArg, dep) {
    department.forEach(dp => {
        const element = dp.departmentName.toString().toLowerCase();
        if (element === departmentArg) {
            dep = element;
        }
    });
    return dep;
}