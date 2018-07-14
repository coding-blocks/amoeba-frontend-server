const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const request = require('request-promise')

const { getHtmlFromTemplate } = require('../services/templates')

const cookHTML = async (templateFileName, data) => {
  const index = await fs.readFile(path.join(__dirname, '../dist/index.html'), 'utf-8')
  const $ = cheerio.load(index)
  const renderedTemplate = getHtmlFromTemplate(templateFileName, data)
  $('body').append(`
    <noscript>
      ${renderedTemplate}
    </noscript>
  `)
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