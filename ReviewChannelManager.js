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

function GetWrittenReviewDates() {
    let actualDates = [];
    try {
        const stringDates = fs.readFileSync('./reviews.json');
        if (!isEmpty(stringDates))
            actualDates = JSON.parse(stringDates);
    } catch (error) {
        console.log(error);
        return;
    }
    return actualDates;
}

function WriteDateReviewToFile(reviewDate) {
    if (!reviewDate)
        return console.log('C\'è un problema con il reperimento della data dal front end');

    let allDates = [];
    allDates = GetWrittenReviewDates();
    allDates.push(reviewDate);

    try {
        const data = JSON.stringify(allDates, null);
        fs.writeFileSync('./reviews.json', data);
    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = {
    GetReviewChannelID,
    GetWrittenReviewDates,
    WriteDateReviewToFile
}