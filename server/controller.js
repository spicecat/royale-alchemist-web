const { commands, getReply, sendSlash } = require('./client');

const sendSlashQuery = (command, query) => {
    const formatArgs = (command, query) =>
        COMMANDS[command].map(arg => query[arg])
    return sendSlash(command, formatArgs(command, query))
};

const getDecks = async query => {
    await sendSlashQuery('deck', query);

    // const formatCommand = ({ trophies = '', name = '', clan = '', type = '' }) => `!deck ${trophies} ${name} clan: ${clan} ${type}:`,
    //     formatReply = ({ content }) =>
    //         content === 'Could not find any results' ? [] :
    //             content.split('\n').map(p => ({ [p.slice(0, p.indexOf(': <:'))]: p.slice(2 + p.indexOf(': <:'), -1).split('>').map(c => c.slice(2, -19)) }));
    // try {
    //     const reply = await retry(async () => {
    //         await target.send(formatCommand(query));
    //         return getReply();
    //     })
    //     return reply ? formatReply(reply) : 408;
    // } catch (e) { return; }
};
const sendBodyOrStatus = (body, res) => {
    if (typeof body === 'number') res.sendStatus(body);
    else res.status(200).send(body);
};

const deckController = async ({ query }, res) =>
    sendBodyOrStatus(await (getDecks(query)), res);

module.exports = { deckController };