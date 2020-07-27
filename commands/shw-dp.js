module.exports = {
    name: 'shw-dp',
    description: 'Mostra tutti i dipartimenti con i relativi membri',
    cooldown: 2,
    args: false,
    numberArgs: 0,
    usage: ' ',
    execute(message, args, department) {
        if (department.length === 0) {
            console.log('Non ci sono dipartimenti registrati');
        }

        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            const membersNames = element.GetMembers();
            const departmentName = element.departmentName.toString();
            console.log(departmentName);
            console.log(membersNames);
        }

        // TODO: Da finire una volta aggiunti comandi per inserire membri
    }



}