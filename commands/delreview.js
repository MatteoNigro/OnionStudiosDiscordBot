const ReviewChannelManager = require('../ReviewChannelManager');
const moment = require('moment');
const ReviewDatesManager = require('../ReviewDatesManager');

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
        const foundCheck = dailyAlreadyDone.indexOf(dateToDelete);
        if (foundCheck < 0) {
            message.author.send(`La review in data ${dateToDelete} che stai cercando di eliminare non è mai stata fatta, quindi non c'è un cazzo da eliminare 😃`);
            return;
        }

        // TODO: SUPER DUPER IMPORTANT --> make the review.js file store and array of objects where the first attribute is the department and the second is the date and update all check in the code to include the department.

        // TODO: ONLY AFTER THE ABOVE --> Create the timer feature to keep track of the time between reviews.

        let lastMessageFound = lastMessage;

        message.author.send(`Sto cercando la daily review in data ${dateToDelete} ... \nLa durata della ricerca dipende da quanto è vecchia la review, nel caso ci vorrà un po \nNel frattempo puoi comunque eseguire altre operazioni che non dipendono da questa.`);

        while (lastMessageFound !== (lastMessageFound = await logReturnLast(reviewChannel, {
                limit: 2,
                before: lastMessageFound.id
            }, lastMessageFound, dateToDelete))) {

            if (dailyReviewFound) {
                const dates = ReviewDatesManager.GetWrittenReviewDates();
                const index = dates.indexOf(dateToDelete);
                if (index > -1) {
                    dates.splice(index, 1);
                    ReviewDatesManager.WriteAllDateReviewsToFile(dates);
                    message.author.send(`Trovata! La review in data ${dateToDelete} è stata eliminata dalla lista`);
                    break;
                }
                message.author.send(`Qualcosa è andato storto, contattare l'assistenza indipendentemente dalla riuscita o meno dell'operazione`);
                break;
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