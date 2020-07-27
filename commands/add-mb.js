module.exports = {
    name: 'add-mb',
    description: 'Aggiunge uno o più nuovi membri ad un dipartimento',
    cooldown: 5,
    args: true,
    numberArgs: 3,
    usage: '<department-name> <member-name> <...>',
    execute(message, args, department) {
        const departmentArg = args.shift().toLowerCase();
        let dep;
        let reply = ' ';
        department.forEach(dp => {
            const element = dp.departmentName.toString().toLowerCase();
            if (element === departmentArg) {
                dep = element;
            }
        });

        if (!dep) {
            reply = 'Il primo argomento DEVE essere il nome di un dipartimeto esistente!';
            console.log(reply);
            return;
        }

        let members = [];

        for (let i = 0; i < args.length; i++) {
            members.push(args[i]);
        }

        console.log(members);
        // Fino a qui funziona


        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            if (element.departmentName.toString().toLowerCase() === departmentArg) {

            }
        }

        console.log("Todo bien!");
    }
}