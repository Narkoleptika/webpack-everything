require('isomorphic-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const { createServer } = require('http')
const spdy = require('spdy')
const cors = require('cors')
const { isProd, resolve } = require('./helpers')
const graphql = require('./graphql')

const app = express()

const {
    API_PORT: PORT = 3002,
    API_SSL: SSL = 3003,
    API_HOST: HOST = 'localhost',
    ORIGIN = 'localhost',
    NO_SSL = false,
    KEY = '../private/server.key',
    CERT = '../private/server.crt',
    CA
} = process.env

const corsOptions = {
    origin: (origin, callback)=> {
        let originRegex = new RegExp(ORIGIN)
        if (!origin || originRegex.test(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Origin not permitted'))
        }
    },
    credentials: true
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const createSubscriptionServer = graphql(app)

const httpServer = createServer(app)

httpServer.listen(PORT, HOST, (err)=> {
    if (err) {
        console.error(err)
        return process.exit(1)
    }
    createSubscriptionServer(httpServer)
    console.log(`HTTP listening at: ${HOST}:${PORT}.`)
})
if (isProd && !NO_SSL) {
    const options = {
        key: fs.readFileSync(resolve(KEY)),
        cert: fs.readFileSync(resolve(CERT)),
        ca: CA ? fs.readFileSync(resolve(CA)) : null
    }

    const httpsServer = spdy.createServer(options, app)
    httpsServer.listen(SSL, HOST, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        createSubscriptionServer(httpsServer)
        console.log(`HTTPS listening at: ${HOST}:${SSL}.`)
    })
}
