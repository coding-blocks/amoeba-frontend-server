const Router = require('express').Router()
const rp = require('request-promise')
const sm = require('sitemap')

const { API } = require('../config')


Router.get('/sitemap.xml', async (req, res) => {
  const courses = JSON.parse(await rp(API.COURSE_LIST))
  const coursesUrls  = courses.map(course => {
    const options = {
      changefreq: 'weekly',
      priority: 0.8
    }
    options.url = course.slug ? `/courses/${course.slug}` : `/courses/${course.id}`
    return options
  })
  
  const sitemap = sm.createSitemap({
    hostname: 'https://online.codingblocks.com',
    cacheTime: 600000,
    urls: [
      {
        url: '/',
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: '/courses',
        changefreq: 'daily',
        priority: 0.9
      },
      ...coursesUrls
    ]
  })

  sitemap.toXML(function (err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header('Content-Type', 'application/xml');
    res.send( xml );
  })

})


module.exports = Router