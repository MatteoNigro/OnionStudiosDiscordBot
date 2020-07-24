module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(message, args, department) {
        message.channel.send('Boop.');
        message.channel.send('Boop.');
    }
}