const express = require('express')
const morgan = require('morgan')
const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const deserializer = require('jsonapi-deserializer').deserialize;
const { cookHTML, getAPIdata } = require('./utils')
const courseRouter = require('./routes/courses')
const sitemap = require('./routes/sitemap')

const app = express()
const config = require('./config.js')

const port = config.PORT || '8080'

app.use(morgan('dev'))

app.get('/', async (req, res, next) => {

  let dataFetch = {}
  let getCourses = getAPIdata(config.API.RECOMMENDED_COURSE);
  let getAnnouncements = getAPIdata(config.API.ANNOUNCEMENTS);

  Promise.all([getCourses, getAnnouncements]).then(async (values) => {
    dataFetch.courses = deserializer(values[0])
    dataFetch.announcements = values[1].data;

    const html = await cookHTML('index', {
      baseUrlApi: config.API.BASE_URL,
      courses: dataFetch.courses,
      announcements: dataFetch.announcements,
      epoch: Math.round((new Date()).getTime() / 1000)
    }, {
      type: "all-courses",
      courses: dataFetch.courses
    })
    res.send(html)
  }).catch((e) => {
    console.error(e);
    next();
  })
})

app.use(sitemap)
app.use('/courses', courseRouter)

app.use(express.static('dist'))


app.get('*', async (req, res) => {
  const html = await cookHTML('forward', {})
  res.send(html)
})


app.listen(config.PORT || '8080', function () {
  console.log('Serving Content on', port)
})