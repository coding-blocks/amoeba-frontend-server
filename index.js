const express = require('express')
const morgan = require('morgan')
const { cookHTML, getAPIdata } = require('./utils')
const sitemap = require('./routes/sitemap')

require('./prerender')

const app = express()
const config = require('./config.js')

const port = config.PORT || '8080'

app.use(morgan('dev'))

const prerenderMiddleware = require('prerender-node')
prerenderMiddleware.set('prerenderServiceUrl', 'http://localhost:' + config.PRERENDER.PORT);
prerenderMiddleware.set('crawlerUserAgents', [...prerenderMiddleware.crawlerUserAgents, 'structured'])

// app.get('/', prerenderMiddleware)

app.use(sitemap)
// app.use((req, res, next) => {
// const prerender = [/\/courses\/.*/, /\/jobs\/.*/].some(r => r.test(req.path))
//   if (prerender)
//     prerenderMiddleware(req, res, next)
//   else
//     next()
// })

app.use(prerenderMiddleware)

app.use(express.static('dist'))


app.get('*', async (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})


app.listen(config.PORT || '8080', function () {
  console.log('Serving Content on', port)
})