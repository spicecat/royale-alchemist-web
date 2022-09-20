const { Client } = require('discord.js-selfbot-v13');
const { TIMEOUT, RETRY_LIMIT } = require('./config');

const { TOKEN, TARGET, CHANNEL } = process.env;

const client = new Client({ checkUpdate: false });

const pickArr = (obj, paths) => obj.map(e => pick(e, paths));
const pick = (obj, paths) => paths.reduce((res, key) => ({ ...res, [key]: obj[key] }), {});

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
    commands = await channel.recipient.application.commands.fetch()
    commands = pickArr(commands, ['name', 'description', 'options']);
    commands = commands.map(({ options, ...command }) => ({ options: pickArr(options, ['type', 'name', 'description', 'required', 'minValue', 'maxValue']), ...command }))
});

client.on('messageCreate', a => console.log(a, 123))
client.on('messageUpdate', a => console.log(a, 321))

const retry = async (cmd, count = RETRY_LIMIT) => {
    const ret = await cmd();
    return ret || !count ? ret : retry(cmd, count - 1);
};

client.login(TOKEN);

module.exports = { commands, getReply, sendSlash };