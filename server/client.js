const { Client } = require('discord.js-selfbot-v13');
const { TIMEOUT, RETRY_LIMIT } = require('./config');

const { TOKEN, TARGET, CHANNEL } = process.env;

const client = new Client({ checkUpdate: false });

let channel, commands;

const sendSlash = async (commandName, args) => {
    const a = await channel.sendSlash(TARGET, commandName, args);
    console.log(a, typeof a)
}

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
    commands = await channel.recipient.application.commands.fetch();
    commands = commands.map(({ name, description, options }) => ({ name, description, options }));
    console.log(commands[0].options);
});

// client.on('apiResponse', a => console.log(a))

const retry = async (cmd, count = RETRY_LIMIT) => {
    const ret = await cmd();
    return ret || !count ? ret : retry(cmd, count - 1);
};

client.login(TOKEN);

module.exports = { getReply, sendSlash };