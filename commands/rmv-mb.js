RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'rmv-mb',
    description: 'Rimuove uno o più membri da uno specifico reparto',
    cooldown: 5,
    args: true,
    minArgs: 2,
    multipleInput: true,
    usage: '<department-name> <member-name> <...>',
    execute(message, args, department) {
        const departmentArg = args.shift().toLowerCase();

        let reply = ' ';
        let dep;
        dep = CheckDepartmentExistence(department, departmentArg, dep)

        if (!dep) {
            reply = 'Il primo argomento DEVE essere il nome di un dipartimeto esistente!';
            message.channel.send(reply);
            return;
        }

        department = RemoveAllRequestedMembers(args, department, departmentArg, reply, message);

        RWHelper.WriteNewDPToFile(department);
    }

}

//============================================ FUNCTIONS ======================================================================

function RemoveAllRequestedMembers(args, department, departmentArg, reply, message) {
    const members = args.slice(0);
    for (let i = 0; i < department.length; i++) {
        const element = department[i];
        if (DepartmentFound(element, departmentArg)) {
            members.forEach(mb => {
                const mbLowerCase = mb.toLowerCase();
                reply = element.RemoveMember(mbLowerCase);
                message.channel.send(reply);
            });
        }
    }
    return department;
}

function DepartmentFound(element, departmentArg) {
    return element.departmentName.toString().toLowerCase() === departmentArg;
}

function CheckDepartmentExistence(department, departmentArg, dep) {
    department.forEach(dp => {
        const element = dp;
        if (DepartmentFound(element, departmentArg)) {
            dep = element;
        }
    });
    return dep;
}