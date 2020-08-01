const RWHelper = require('../ReadWriteHelper');

module.exports = {
    name: 'rmv-dp',
    description: 'Rimuove un dipartimento dal team',
    cooldown: 5,
    args: true,
    minArgs: 1,
    multipleInput: false,
    usage: '<department-name>',
    execute(message, args, department, link) {
        const arg = args.shift().toLowerCase();

        let reply = ' ';
        for (let i = 0; i < department.length; i++) {
            const element = department[i].departmentName.toString().toLowerCase();
            if (element === arg) {
                department.splice(i, 1);
                RWHelper.WriteNewDPToFile(department);
                reply = `Il dipartimento ${element} è stato eliminato`;
                message.channel.send(reply);
                return;
            }
        }

        reply = 'Il dipartimento non esiste';
        message.channel.send(reply);
    }
}