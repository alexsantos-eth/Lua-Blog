// EXPRESS
const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')

// APP
const app = express()

// MIDDLEWARE
app.use(cors())
app.use(require('prerender-node'))

// LAMBDA
module.exports.handler = serverless(app)
