const config = require('./config.json');

function GetReviewChannelID(webSocket, message) {
    var channels = [];
    webSocket.client.guilds.cache.first().channels.cache
        .filter(c => c.type == 'text' && c.name == config.defaultChannel)
        .forEach(c => {
            channels.push(c.id);
        });

    if (!channels)
        return message.author.send(`Non sono presenti canali testuali con il nome ${config.defaultChannel}! Sistema o, se non puoi, contatta subito chi ha i permessi per farlo`);

    if (channels.length > 1)
        return message.author.send(`Ci sono multipli canali testuali con il nome ${config.defaultChannel}! Sistema o, se non puoi, contatta subito chi ha i permessi per farlo`);
    return channels;
}

module.exports = {
    GetReviewChannelID
}