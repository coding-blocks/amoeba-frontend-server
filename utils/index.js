const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise')
const config = require('../config')
const moment = require('moment')

const { getHtmlFromTemplate } = require('../services/templates')

const cookSEO = (seoData) => {
  let data = {}
  if (seoData.type === 'all-courses') {
    data["@context"] = "http://schema.org"
    data["@type"] = "ItemList"
    data["itemListElement"] = []
    for (let i = 0; i < seoData.courses.length; i++) {
      let course = seoData.courses[i]
      if (course.unlisted === true) continue
      let obj = {
        "@type": "ListItem",
        "position": i+1,
        "item": {
          "@context": "http://schema.org",
          "@type": "Course",
          "name": course.title,
          "description": course.subtitle,
          "provider": {
            "@type": "Organization",
            "name": "Coding Blocks",
            "sameAs": "https://online.codingblocks.com/"
          },
          "url":`${config.BASE_URL}/#${course.slug}`
        }
      }
      data["itemListElement"].push(obj)
    }

  } else if (seoData.type === 'course') {
    let course = seoData.course
    let ratings = seoData.ratings
    
    if (course.unlisted === false) {
      data = {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": course.title,
        "image": [
          course.logo
        ],
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": ratings.length > 0 ? ratings[0].value : 5 ,
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": ratings.length > 0 ? ratings[0].user.firstname + ' ' + ratings[0].user.lastname : 'Abhishek Gupta'
          }
        },
        "url": `${config.BASE_URL}/#${course.slug}`,
        "description": course.subtitle,
        "brand": {
          "@type": "Thing",
          "name": "Coding Blocks"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": course.rating,
          "reviewCount": (parseInt(course.id) * 9) || 40
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "priceValidUntil": moment.unix(Number(course["active-runs"][0]['enrollment-end'])).format('YYYY-MM-DD'),
          "price": course.runs.reduce((acc, curr) =>
                  ((acc.price < curr.price) ? acc : curr)).price,
          "availability": "http://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Coding Blocks"
          }
        }
      }
    }
  }
  return JSON.stringify(data)
}

const cookHTML = async (templateFileName, data, seoData, metaData) => {
  const index = await fs.readFile(path.join(__dirname, '../dist/index.html'), 'utf-8')
  const $ = cheerio.load(index)
  const renderedTemplate = getHtmlFromTemplate(templateFileName, data)
  $('body').append(`
    <noscript>
      ${renderedTemplate}
    </noscript>
  `)
  if (seoData !== undefined) {
    $('body').append(`
    <script type="application/ld+json">
        ${cookSEO(seoData)}
    </script>
    `)
  }
  if (metaData !== undefined) {
    // remove existing meta tag

    $('meta[name=description]').remove()

    $('head').append(`
      <meta type='description' content=${JSON.stringify(metaData.description)}/>
      <meta type='title' content=${JSON.stringify(metaData.title)}/>
      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:site" content="@CodingBlocksIn" />
      <meta property="og:title" content=${JSON.stringify(metaData.title)}/>
      <meta property="og:description" content=${JSON.stringify(metaData.description)}/>
      <meta property="og:image" content=${JSON.stringify(metaData.image)} />
      <meta property="og:site_name" content="Coding Blocks Online">
      <meta property="og:url" content="https://online.codingblocks.com/" />
      <meta itemprop="name" content=${JSON.stringify(metaData.title)}>
      <meta itemprop="description" content=${JSON.stringify(metaData.description)}>
      <meta itemprop="image" content=${JSON.stringify(metaData.image)}>
      `)
  }

  return $.html()
}

const getAPIdata = function(url) {
  return request({
    url,
    json: true
  })
};


const isNumeric = function(num) {
  return !isNaN(num)
};




module.exports = {
  cookHTML, getAPIdata, isNumeric
}
