const prerender = require('prerender');
const config = require('./config')
const server = prerender({
  port: config.PRERENDER.PORT
})

server.init({
  pageLoadTimeout: config.TIMEOUT
})

process.env.CACHE_ROOT_DIR = __dirname + '/cache'
process.env.CACHE_LIVE_TIME = 5 * 60 * 60 // 5 hrs

server.use(require('prerender-file-cache'));

server.start()

