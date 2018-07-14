const config = require('../config');
const deserializer = require('jsonapi-deserializer').deserialize;
const { cookHTML, getAPIdata, isNumeric } = require('../utils');

const express = require('express')
var route = express.Router();


route.get('/:id', async (req, res, next) => {

  let id = req.params.id

  let dataFetch = {}
  await getAPIdata(config.API.COURSE_URL + id)
    .then((data) => {
      dataFetch.course = deserializer(data)
    }).catch((e) => {
      console.log(e);
      res.send('fuck')
      next();
    })

  await getAPIdata(config.API.RECOMMENDED_COURSE)
    .then((courses) => {
      dataFetch.recommendedCourses = deserializer(courses)
    }).catch((e) => {
      console.log(e);
      next();
    })

  const html = await cookHTML('course', {
    baseUrlApi: config.API.BASE_URL,
    course: dataFetch.course,
    recommendedCourses: dataFetch.recommendedCourses,
    epoch: Math.round((new Date()).getTime() / 1000)
  })
  res.send(html)
})

module.exports = route