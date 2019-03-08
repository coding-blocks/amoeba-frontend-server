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

  Promise.all([getCourse, getRecommendedCourses]).then(async (values) => {
    dataFetch.course = deserializer(values[0])
    dataFetch.recommendedCourses = deserializer(values[1])

    const html = await cookHTML('course', {
      baseUrlApi: config.API.BASE_URL,
      course: dataFetch.course,
      recommendedCourses: dataFetch.recommendedCourses,
      epoch: Math.round((new Date()).getTime() / 1000)
    }, {
      type: "course",
      course: dataFetch.course
    }, {
      description: dataFetch.course.summary,
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