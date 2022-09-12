const express = require('express'),
    cors = require('cors')
if (!process.env.LOADED) require('dotenv-json')()
const { deckController } = require('./controller')

const app = express()

app.use(cors())
app.disable('x-powered-by');
app.use(express.json())

app.get('/deck', deckController)

module.exports = app