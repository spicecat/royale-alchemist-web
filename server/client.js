const { Client } = require('discord.js-selfbot-v13');
const { TIMEOUT, RETRY_LIMIT } = require('./config');

const { TOKEN, TARGET, CHANNEL } = process.env;

const client = new Client({ checkUpdate: false });

let channel;

const sendSlash = (commandName, args) =>
    channel.sendSlash(TARGET, commandName, args);

const getReply = () => Promise.race([
    new Promise(resolve => client.once('messageCreate', resolve)),
    new Promise(resolve => setTimeout(resolve, TIMEOUT))
]);

client.once('ready', async () => {
    console.log('Logged in as:', client.user.username);
    const getChannelId = async (targetId) => {
        const target = await client.users.fetch(targetId);
        const { channelId } = await target.send('hi');
        return channelId;
    }
    channel = await client.channels.fetch(CHANNEL || getChannelId(TARGET));
});

const retry = async (cmd, count = RETRY_LIMIT) => {
    const ret = await cmd();
    return ret || !count ? ret : retry(cmd, count - 1);
};

client.login(TOKEN);

module.exports = { getReply, sendSlash };