module.exports = {
    name: 'shw-dp',
    description: 'Mostra tutti i dipartimenti con i relativi membri',
    cooldown: 2,
    args: false,
    minArgs: 0,
    multipleInput: false,
    usage: ' ',
    execute(message, args, department) {
        if (department.length === 0) {
            console.log('Non ci sono dipartimenti registrati');
        }

        const embed = {
            color: 0x0099ff,
            fields: [
                {
                    name: ' ',
                    value: [],
                    inline: true,
                },
            ],
        };


        // TODO: Prolema con l'embed dinamico --> I campi dell'embed vanno prima creati, ma non possiamo hardcodare a priori il numero da creare...



        for (let i = 0; i < department.length; i++) {
            const element = department[i];
            const fields = embed.fields[i];

            const departmentName = element.departmentName.toUpperCase().toString();
            const memberNames = element.GetMembers();

            fields.name = departmentName;
            fields.value = memberNames;
            fields.inline = true;
        }


        message.channel.send({ embed: embed });





    }



}