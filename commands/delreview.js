const ReviewChannelManager = require('../ReviewChannelManager');

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

        let lastMessageFound = lastMessage;

        while (lastMessageFound !== (lastMessageFound = await logReturnLast(reviewChannel, {
                limit: 2,
                before: lastMessageFound.id
            }, lastMessageFound))) {
            // EMPTY BODY
        }

        new Promise((resolve, reject) => {
            setTimeout(() => resolve(''), 2000);
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('Comincio la ricerca...');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('Speriamo non ci voglia tanto');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('Ma quanto cazzo devo andare indietro per trovarla ooooooh');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('Mi prendi per il culo?');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('3');
        }).then(() => {
            setTimeout(() => resolve(''), 1000);
            console.log('2');
        }).then(() => {
            setTimeout(() => resolve(''), 1000);
            console.log('1');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('Trovata!');
        }).then(() => {
            setTimeout(() => resolve(''), 2000);
            console.log('No scherzo, continuo la ricerca...');
        });

        // TODO: Usare una variabile booleana per identificare il momento in cui la funzione asincrona ha trovato la review da eliminare e porlo come condizione di terminazione del while della chain di Promise. Da provare per lo meno.

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

function logJoke(string) {
    console.log(string);
    return Promise.resolve();
}