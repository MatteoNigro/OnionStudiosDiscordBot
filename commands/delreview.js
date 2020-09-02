const ReviewChannelManager = require('../ReviewChannelManager');
const moment = require('moment');
const ReviewDatesManager = require('../ReviewDatesManager');
const daily = require('./daily');

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

        const dailyAlreadyDone = ReviewDatesManager.GetWrittenReviewDates();

        let found = false;
        dailyAlreadyDone.forEach(daily => {
            if (dateToDelete === daily.date)
                found = true;
        });

        if (!found) {
            message.author.send(`La review in data ${dateToDelete} che stai cercando di eliminare non è mai stata fatta, quindi non c'è un cazzo da eliminare 😃`);
            return;
        }

        let lastMessageFound = lastMessage;

        message.author.send(`Sto cercando la daily review in data ${dateToDelete} ... \nLa durata della ricerca dipende da quanto è vecchia la review, nel caso ci vorrà un po \nNel frattempo puoi comunque eseguire altre operazioni che non dipendono da questa.`);

        while (lastMessageFound !== (lastMessageFound = await logReturnLast(reviewChannel, {
                limit: 2,
                before: lastMessageFound.id
            }, lastMessageFound, dateToDelete))) {


            let dailyDeleted = false;
            if (dailyReviewFound) {
                const daily = ReviewDatesManager.GetWrittenReviewDates();

                for (let i = 0; i < daily.length; i++) {
                    const d = daily[i];
                    if (d.date === dateToDelete); {
                        daily.splice(i, 1);
                        dailyDeleted = true;
                    }
                }

                // TODO: Not tested already, test it first of all 

                if (dailyDeleted) {
                    ReviewDatesManager.WriteAllDateReviewsToFile(daily);
                    message.author.send(`Trovata! La review in data ${dateToDelete} è stata eliminata dalla lista`);
                    return;
                }

                message.author.send(`Qualcosa è andato storto, contattare l'assistenza indipendentemente dalla riuscita o meno dell'operazione`);
            }
        }

    }
}

let dailyReviewFound = false;

// ===================================== FUNCTIONS ==============================================

async function logReturnLast(chan, option, prevMsg, dateToDelete) {
    return chan.messages.fetch(option)
        .then(async msgs => {
            if (msgs.size === 0) {
                if (prevMsg.embeds.length != 0) {
                    const dailyDate = extractDateFromEmbed(prevMsg);
                    if (dailyDate === dateToDelete) {
                        prevMsg.delete().then(() => console.log(`Review in date ${dailyDate} deleted from Discord chat`));
                        dailyReviewFound = true;

                    }
                }
                return prevMsg;
            }
            let last = msgs.last();
            for (const [id, msg] of msgs) {
                let tmp = (id === last.id) ? prevMsg : msg;
                if (tmp.embeds.length != 0) {
                    const dailyDate = extractDateFromEmbed(tmp);
                    if (dailyDate === dateToDelete) {
                        tmp.delete().then(() => console.log(`Review in date ${dailyDate} deleted from Discord chat`));
                        dailyReviewFound = true;
                    }
                }
            }
            return last;
        })
        .catch(err => console.log('ERR>>', err));
}

function extractDateFromEmbed(tmp) {
    const embedTitle = tmp.embeds[0].title;
    const titleArray = embedTitle.split(' ');
    const dailyDate = titleArray.pop().replace('[', '').replace(']', '');
    return dailyDate;
}