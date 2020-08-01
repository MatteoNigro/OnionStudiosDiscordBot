module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(message, args, department, link) {
        message.channel.send('Boop.');
        message.channel.send('Boop.');
    }
}