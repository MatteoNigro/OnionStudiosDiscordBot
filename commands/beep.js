module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(message, args) {
        message.channel.send('Boop.');
        message.channel.send('Boop.');
    }
}