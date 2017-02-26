process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'
const fs = require('fs')
const path = require('path')
const express = require('express')
const spdy = require('spdy')
const compression = require('compression')
const serialize = require('serialize-javascript')
const resolve = file=> path.resolve(__dirname, file)
const app = express()

let indexHTML
let renderer

if (isProd) {
    // in production: create server renderer and index HTML from real fs
    renderer = createRenderer(fs.readFileSync(resolve('./dist/server.js'), 'utf-8'))
    indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
} else {
    require('./build/setup-dev-server')(app, {
        bundleUpdated: bundle=> {
            renderer = createRenderer(bundle)
        },
        indexUpdated: index=> {
            indexHTML = parseIndex(index)
        }
    })
}

function createRenderer(bundle) {
    return require('vue-server-renderer').createBundleRenderer(bundle, {
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}

function parseIndex(template) {
    const appMarker = '<div id="app"></div>'
    const i = template.indexOf(appMarker)
    return {
        head: template.slice(0, i),
        tail: template.slice(i + appMarker.length)
    }
}

const serve = (path, cache)=> express.static(resolve(path), {
    maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

function updateMeta(head, context) {
    const title = context.title || false
    const description = context.description || false
    const keywords = context.keywords || false
    if (title) {
        head = head.replace(/(<title>)(.*?)(<\/title>)/, `$1${title}$3`)
    }
    if (description) {
        head = head.replace(/(<meta name="description" content=")(.*?)(">)/, `$1${description}$3`)
    }
    if (keywords) {
        head = head.replace(/(<meta name="keywords" content=")(.*?)(">)/, `$1${keywords}$3`)
    }
    return head
}

app.use(compression({threshold: 0}))
app.use('/dist', serve('./dist'))
app.use('/public', serve('./public'))
app.use('/sw.js', serve('./dist/sw.js'))
app.get('*', (req, res)=> {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }

    res.setHeader('Content-Type', 'text/html')
    const context = {
        url: req.url
    }

    const renderStream = renderer.renderToStream(context)

    renderStream.once('data', ()=> {
        res.write(updateMeta(indexHTML.head, context))
    })

    renderStream.on('data', chunk=> {
        res.write(chunk)
    })

    renderStream.on('end', ()=> {
        // embed initial store state
        if (context.initialState) {
            res.write(`<script>window.__INITIAL_STATE__=${serialize(context.initialState, { isJSON: true })}</script>`)
        }
        res.end(indexHTML.tail)
    })

    renderStream.on('error', err=> {
        if (err && err.code === '404') {
            res.status(404).end('404 | Page Not Found')
            return
        }
        // Render Error Page or Redirect
        res.status(500).end('Internal Error 500')
        console.error(`error during render : ${req.url}`)
        console.error(err)
    })
})

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'

if (isProd && !process.env.NO_SSL) {
    const ssl = process.env.SSL || 3001
    const options = {
        key: fs.readFileSync(resolve(process.env.KEY || './private/server.key')),
        cert: fs.readFileSync(resolve(process.env.CERT || './private/server.crt')),
        ca: process.env.CA ? fs.readFileSync(resolve(process.env.CA)) : null
    }
    express().all('*', (req, res)=> {
        let hostname = req.headers.host.replace(/:\d+$/, '')
        return res.redirect(301, `https://${hostname}:${ssl}${req.originalUrl}`)
    }).listen(port, host, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        console.log(`HTTP listening at: ${host}:${port}.`)
    })

    spdy.createServer(options, app).listen(ssl, host, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        console.log(`HTTPS listening at: ${host}:${ssl}.`)
    })
} else {
    app.listen(port, host, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        console.log(`HTTP listening at: ${host}:${port}.`)
    })
}
