const Handlebars = require("handlebars");
const path = require('path')
const fs = require('fs-extra')

// precompile templates

const viewsDir = path.join(__dirname, '../views')
const templates = fs.readdirSync(viewsDir)

const CompiledTemplates = templates.map(filename => {
  const templateSource = fs.readFileSync(path.join(viewsDir, filename), 'utf-8')
  return {
    name: filename.split('.')[0],
    template: Handlebars.compile(templateSource)
  }
}).reduce((acc, val) => {
  return {
    ...acc,
    [val.name]: val.template
  }
}, {})

module.exports = {
  getHtmlFromTemplate (templateName, context) {
    return CompiledTemplates[templateName](context)
  },
  CompiledTemplates
}