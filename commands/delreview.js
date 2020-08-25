const ReviewChannelManager = require('../ReviewChannelManager');
const moment = require('moment');

module.exports = {
    name: 'delreview',
    description: 'Elimina una specifica review',
    cooldown: 5,
    args: true,
    minArgs: 1,
    multipleInput: false,
    usage: '<reviewDate>',
    guildOnly: true,
    async execute(message, args, webSocket) {
        const reviewChannelID = ReviewChannelManager.GetReviewChannelID(webSocket, message).shift();
        const reviewChannel = message.client.guilds.cache.first().channels.cache.get(reviewChannelID);
        const lastMessage = reviewChannel.lastMessage;

        const dateArg = args.shift();
        const readableDate = dateArg.split('/').reverse().join('-');

        const dateToDelete = moment(readableDate).format("DD[/]MM[/]YYYY");

        if (dateArg != dateToDelete) {
            message.author.send('La data da te inserita non è nel formato corretto e potrebbero esserci errori.');
            return;
        }
        // TODO: Delete this return below and search and destroy the daily review with that precise date.
        return;
        let lastMessageFound = lastMessage;

        while (lastMessageFound !== (lastMessageFound = await logReturnLast(reviewChannel, {
                limit: 2,
                before: lastMessageFound.id
            }, lastMessageFound))) {
            // EMPTY BODY
        }

    }
}

// ===================================== FUNCTIONS ==============================================

async function logReturnLast(chan, option, prevMsg) {
    return chan.messages.fetch(option)
        .then(async msgs => {
            if (msgs.size === 0) {
                if (prevMsg.embeds.length != 0)
                    console.log(prevMsg.embeds[0].title);
                else
                    console.log(prevMsg.content);
                return prevMsg;
            }
            let last = msgs.last();
            for (const [id, msg] of msgs) {
                let tmp = (id === last.id) ? prevMsg : msg;
                if (tmp.embeds.length != 0)
                    console.log(tmp.embeds[0].title);
                else
                    console.log(tmp.content);
            }
            return last;
        })
        .catch(err => console.log('ERR>>', err));
}