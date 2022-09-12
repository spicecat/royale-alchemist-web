const { Client } = require('discord.js-selfbot-v13');
const { TIMEOUT, RETRY_LIMIT } = require('./config');
const { TOKEN, TARGET_ID } = process.env;

const client = new Client({ checkUpdate: false });
let target;
client.once('ready', async () => {
    console.log('Logged in as:', client.user.username);
    target = await client.users.fetch(TARGET_ID);
    target.send(`hello ${target.username}`);
});

const retry = async (cmd, count = RETRY_LIMIT) => {
    const ret = await cmd();
    return ret || !count ? ret : retry(cmd, count - 1);
};

const getReply = () => Promise.race([
    new Promise(resolve => client.once('messageCreate', resolve)),
    new Promise(resolve => setTimeout(resolve, TIMEOUT))
]);

const getDecks = async query => {
    const formatCommand = ({ trophies = '', name = '', clan = '', type = '' }) => `!deck ${trophies} ${name} clan: ${clan} ${type}:`,
        formatReply = ({ content }) =>
            content === 'Could not find any results' ? [] :
                content.split('\n').map(p => ({ [p.slice(0, p.indexOf(': <:'))]: p.slice(2 + p.indexOf(': <:'), -1).split('>').map(c => c.slice(2, -19)) }));
    try {
        const reply = await retry(async () => {
            await target.send(formatCommand(query));
            return getReply();
        })
        return reply ? formatReply(reply) : 408;
    } catch (e) { return; }
};

client.login(TOKEN);

module.exports = { getDecks };