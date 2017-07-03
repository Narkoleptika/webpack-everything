# Webpack Everything
This is a vue-cli template that comes with webpack, server side rendering (SSR), route level code splitting, and progressive web app (PWA) capabilities. This template requires SSL in production in order to function properly.

## Lighthouse Score
![Lighthouse Score](https://raw.githubusercontent.com/Narkoleptika/webpack-everything/master/lighthouse.png)

[Lighthouse Score for /](https://googlechrome.github.io/lighthouse/viewer/?gist=1714c891a643c7a55ff24361b7c1a270)

![Lighthouse Score](https://raw.githubusercontent.com/Narkoleptika/webpack-everything/master/lighthouse.png)

[Lighthouse Score for /test](https://googlechrome.github.io/lighthouse/viewer/?gist=b04c8377cf5bdd07a0d4ae6b5c0f0329)


## Preprocessors
Choose from
1. Stylus
2. Scss

## Geting Started
```bash
npm install -g vue-cli || yarn global add vue-cli
vue init narkoleptika/webpack-everything example-project
cd example-project
npm install || yarn
npm run dev
```
Dev server with SSR and HMR will run by default at `http://localhost:3000`

## Production
```bash
npm run prod
```

### SSL
You should use SSL. ___This template assumes the use of encryption by default___. You will need to set the following environment variables to run production.
* `SSL` - SSL port -- default: `3001`
* `CERT` - Path to the ssl certificate -- default: `./private/server.crt`
* `KEY` - Path to the server key -- default: `./private/server.key`

### Testing SSL
You can self sign some certificates for localhost (Which are handy to have for testing SSL in general)
```bash
mkdir private
cd private
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

It is a good idea to test production in incognito mode to avoid troubles clearing the 301 redirect later.

### No SSL
Use the following to test production without SSL
```bash
npm run prod--no-ssl
```

__Please note:__ Service workers require ssl in order to work. If you don't use encryption, you will lose offline capabilities.

## Bundle Analyzer
This template comes with `webpack-bundle-analyzer` which will generate a report of the chunks that get output from webpack. It will run by default in development and can be enabled for production by setting the `STATS` env var.

## Environment Vars
* `NODE_ENV`
* `PORT` - default: `3000`
* `HOST` - default: `0.0.0.0`
* `SSL` - default: `3001`
* `KEY` - default: `./private/server.key`
* `CERT` - default: `./private/server.crt`
* `CA`
* `NO_SSL`
* `STATS`

## Thanks
* [Vue](https://vuejs.org/)
* [Vuetify](https://vuetifyjs.com/)
