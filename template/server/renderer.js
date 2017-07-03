process.env.VUE_ENV = 'server'
const isProd = process.env.NODE_ENV === 'production'
const fs = require('fs')
const path = require('path')
const express = require('express')
const spdy = require('spdy')
const compression = require('compression')
const app = express()

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'
const ssl = process.env.SSL || 3001

const resolve = file=> path.resolve(__dirname, file)

const serve = (path, cache)=> express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

const createRenderer = (serverBundle, clientManifest, template)=> {
    return require('vue-server-renderer').createBundleRenderer(serverBundle, {
        template,
        clientManifest,
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}

let renderer

if (isProd) {
    // in production: create server renderer and index HTML from real fs
    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    const serverBundle = require('../dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync(resolve('../dist/index.html'), 'utf-8')
    renderer = createRenderer(serverBundle, clientManifest, template)
} else {
    require('../build/setup-dev-server')(app, (serverBundle, clientManifest, template)=> {
        renderer = createRenderer(serverBundle, clientManifest, template)
    })
}

const render = (req, res, context, s)=> renderer.renderToStream(context)
    .on('end', ()=> console.log(`whole request: ${Date.now() - s}ms`))
    .on('error', err=> {
        if (err && err.manual) {
            res.status(err.code)
            return render(req, res, {url: err.url}, s)
        }
        // Render Error Page or Redirect
        res.status(500).end('Internal Error 500')
        console.error(`error during render : ${req.url}`)
        console.error(err)
    })
    .pipe(res)

app.use((req, res, next)=> {
    if (isProd && !req.secure && !process.env.NO_SSL) {
        let hostname = req.headers.host.replace(/:\d+$/, '')
        return res.redirect(301, `https://${hostname}:${ssl}${req.originalUrl}`)
    }
    return next()
})

app.use(compression({threshold: 0}))
app.use('/dist', serve('../dist', true))
app.use('/public', serve('../public', true))
app.use('/sw.js', serve('../dist/sw.js', true))
app.get('*', (req, res)=> {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }

    const s = Date.now()

    res.setHeader('Content-Type', 'text/html')

    render(req, res, {url: req.url}, s)
})

app.listen(port, host, (err)=> {
    if (err) {
        console.error(err)
        return process.exit(1)
    }
    console.log(`HTTP listening at: ${host}:${port}.`)
})

if (isProd && !process.env.NO_SSL) {
    const options = {
        key: fs.readFileSync(resolve(process.env.KEY || '../private/server.key')),
        cert: fs.readFileSync(resolve(process.env.CERT || '../private/server.crt')),
        ca: process.env.CA ? fs.readFileSync(resolve(process.env.CA)) : null
    }

    spdy.createServer(options, app).listen(ssl, host, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        console.log(`HTTPS listening at: ${host}:${ssl}.`)
    })
}
