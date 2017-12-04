{{#if_eq apollo true}}require('isomorphic-fetch')
{{/if_eq}}process.env.VUE_ENV = 'server'
const fs = require('fs')
const express = require('express')
const spdy = require('spdy')
const compression = require('compression')
const expressStaticGzip = require('express-static-gzip')
const accepts = require('accepts')
const { compressStream } = require('iltorb')
const { isProd, resolve, serve } = require('./helpers')
const app = express()

const {
    {{#if_eq apollo true}}RENDERER_PORT: {{/if_eq}}PORT = 3000,
    {{#if_eq apollo true}}RENDERER_HOST: {{/if_eq}}HOST = '0.0.0.0',
    {{#if_eq apollo true}}RENDERER_SSL: {{/if_eq}}SSL = 3001,
    NO_SSL = false,
    KEY = '../private/server.key',
    CERT = '../private/server.crt',
    CA
} = process.env

const createRenderer = (serverBundle, clientManifest, template)=> {
    return require('vue-server-renderer').createBundleRenderer(serverBundle, {
        template,
        clientManifest,
        inject: false,
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
    .on('end', ()=> {
        console.log(`whole request: ${Date.now() - s}ms`)
    })
    .on('error', err=> {
        // Render Error Page or Redirect
        console.error(`error during render : ${req.url}`)
        if (err) {
            console.error(err)
            if (err.manual) {
                res.status(err.code)
                return render(req, res, {url: err.url}, s)
            }
        }
        res.status(500).end('Internal Error 500')
    })

app.use((req, res, next)=> {
    if (isProd && !req.secure && !NO_SSL) {
        let hostname = req.headers.host.replace(/:\d+$/, '')
        return res.redirect(301, `https://${hostname}:${SSL}${req.originalUrl}`)
    }
    return next()
})
app.use(compression({ threshold: 0 }))
if (isProd) {
    app.use('/dist', expressStaticGzip(resolve('../dist'), {
        enableBrotli: true,
        indexFromEmptyFile: false,
        maxAge: 1000 * 60 * 60 * 24 * 30
    }))
} else {
    app.use('/dist', serve('../dist', true))
}
app.use('/', serve('../public', true))
app.use('/favicon.ico', serve('../public/favicon/favicon.ico', true))
app.use('/sw.js', serve('../dist/sw.js', true))

app.get('*', (req, res)=> {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }

    res.setHeader('Content-Type', 'text/html')

    const s = Date.now()

    let acceptsBr = accepts(req).encoding(['br'])
    if (acceptsBr) {
        res.setHeader('Content-Encoding', 'br')

        render(req, res, {url: req.url}, s)
        .pipe(compressStream())
        .pipe(res)
    } else {
        render(req, res, {url: req.url}, s)
        .pipe(res)
    }
})

app.listen(PORT, HOST, (err)=> {
    if (err) {
        console.error(err)
        return process.exit(1)
    }
    console.log(`HTTP listening at: ${HOST}:${PORT}.`)
})

if (isProd && !NO_SSL) {
    const options = {
        key: fs.readFileSync(resolve(KEY)),
        cert: fs.readFileSync(resolve(CERT)),
        ca: CA ? fs.readFileSync(resolve(CA)) : null
    }

    spdy.createServer(options, app).listen(SSL, HOST, (err)=> {
        if (err) {
            console.error(err)
            return process.exit(1)
        }
        console.log(`HTTPS listening at: ${HOST}:${SSL}.`)
    })
}
