# Geting Started
```bash
npm install || yarn
npm run dev
```
Dev server with SSR and HMR will run by default at http://localhost:3000

# Production
```bash
npm run prod
```

## SSl
You should use SSL. ___This template assumes the use of encryption by default___. You will need to set the following environment variables to run production.
* SSL - SSL port -- default: 3001
* CERT - Path to the ssl certificate -- default: ./private/server.crt
* KEY - Path to the server key -- default: ./private/server.key

## Testing SSL
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

## No SSL
If you really hate privacy you may set NO_SSL.

Alternatively, you can run
```bash
npm run prod--no-ssl
```

#Environment Vars
* NODE_ENV
* PORT - default: 3000
* HOST - default: localhost
* SSL - default: 3001
* KEY - default: ./private/server.key
* CERT - default: ./private/server.crt
* NO_SSL
