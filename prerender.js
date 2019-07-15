const prerender = require('prerender');
const config = require('./config')
const server = prerender({
  port: config.PRERENDER.PORT
})

server.init({
  pageLoadTimeout: config.TIMEOUT
})

server.use(require('prerender-memory-cache'));

server.start()

