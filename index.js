const express = require('express')
const morgan = require('morgan')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const { cookHTML } = require('./utils')

const app = express()
const config = require('./config.js')

const port = config.PORT || '8080'

app.use(morgan('dev'))

app.get('/', async (req, res) => {
  const html = await cookHTML('index', {name: 'abhishek'})
  res.send(html)
})

app.use(express.static('dist'))

app.listen(config.PORT || '8080', function () {
  console.log('Serving Content on', port)
})