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
  let getCourses = getAPIdata(config.API.RECOMMENDED_COURSE + '?exclude=ratings%2Cinstructors.*%2Cfeedbacks%2Cruns.*&filter%5Brecommended%5D=true&filter%5Bunlisted%5D=false&include=instructors%2Cruns&page%5Blimit%5D=12&sort=difficulty');
  let getAnnouncements = getAPIdata(config.API.ANNOUNCEMENTS + '?sort=order');

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
    },
    {
      description: 'Coding Blocks is the best online programming and software training Institute offer online certification courses in Jave, C++, Android, NodeJs, Data structure, Machine learning, Interview preparation and more.',
      title: 'Best online computer programming and coding courses in India.'
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