const express = require('express')
const morgan = require('morgan')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const deserializer = require('jsonapi-deserializer').deserialize;
const { cookHTML, getAPIdata } = require('./utils')

//const courseRouter = require('./routes/courses')

const app = express()
const config = require('./config.js')

const port = config.PORT || '8080'

app.use(morgan('dev'))

app.get('/', async (req, res, next) => {

  let dataFetch = {}
  //TODO: should the url be static?
  await getAPIdata(config.API.RECOMMENDED_COURSE)
    .then((courses) => {
      dataFetch.courses = deserializer(courses)
    }).catch((e) => {
      console.log(e);
      next();
    })

  await getAPIdata(config.API.ANNOUNCEMENTS)
    .then((list) => {
      dataFetch.announcements = list.data;
    }).catch((e) => {
      console.log(e);
      next();
    })

  //res.json(dataFetch.courses)

  const html = await cookHTML('index', {
    baseUrlApi: config.API.BASE_URL,
    courses: dataFetch.courses,
    announcements: dataFetch.announcements,
    epoch: Math.round((new Date()).getTime() / 1000)
  })

  // res.json(dataFetch.courses)
  res.send(html)
})



app.use(express.static('dist'))


app.get('*', async (req, res) => {
  const html = await cookHTML('forward', {})
  res.send(html)
})


app.listen(config.PORT || '8080', function () {
  console.log('Serving Content on', port)
})