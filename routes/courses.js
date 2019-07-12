const config = require('../config');
const deserializer = require('jsonapi-deserializer').deserialize;
const { cookHTML, getAPIdata, isNumeric } = require('../utils');

const express = require('express')
var route = express.Router();

route.get('/', async (req, res, next) => {
  let dataFetch = {}
  await getAPIdata(config.API.COURSE_URL_WITH_INST_RUNS)
    .then((courses) => {
      dataFetch.courses = deserializer(courses)
    }).catch((e) => {
      console.log(e);
      next()
    })

  const html = await cookHTML('courses', {
    baseUrlApi: config.API.BASE_URL,
    courses: dataFetch.courses,
    epoch: Math.round((new Date()).getTime() / 1000)
  }, undefined,
  {
    description: 'Coding Blocks is the best online programming and software training Institute offer online certification courses in Jave, C++, Android, NodeJs, Data structure, Machine learning, Interview preparation and more.',
    title: 'Best online computer programming and coding courses in India.'
  })
  res.send(html)
})

route.get('/:id', async (req, res, next) => {

  let id = req.params.id

  let dataFetch = {}

  let getCourse = getAPIdata(config.API.COURSE_URL + id)
  let getRecommendedCourses = getAPIdata(config.API.RECOMMENDED_COURSE)
  let getRatings = getAPIdata(config.API.COURSE_RATINGS + id + '?page%5Boffset%5D=0&page%5Blimit%5D=10')

  Promise.all([getCourse, getRecommendedCourses, getRatings]).then(async (values) => {
    dataFetch.course = deserializer(values[0])
    dataFetch.recommendedCourses = deserializer(values[1])
    dataFetch.ratings = deserializer(values[2])

    const html = await cookHTML('course', {
      baseUrlApi: config.API.BASE_URL,
      course: dataFetch.course,
      recommendedCourses: dataFetch.recommendedCourses,
      epoch: Math.round((new Date()).getTime() / 1000)
    }, {
      type: "course",
      course: dataFetch.course,
      ratings: dataFetch.ratings
    }, {
      description: dataFetch.course.seoMeta,
      title: dataFetch.course.subtitle,
      image: dataFetch.course.logo
    })

    res.send(html)
  }).catch((e) => {
    console.log(e);
    next();
  })

})

module.exports = route