const { getDecks } = require('./client');

const sendBodyOrStatus = (body, res) => {
    if (typeof body === 'number') res.sendStatus(body);
    else res.status(200).send(body);
};

const deckController = async ({ query }, res) => sendBodyOrStatus(await (getDecks(query)), res);

module.exports = { deckController };