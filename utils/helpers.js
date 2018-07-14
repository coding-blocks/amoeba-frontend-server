const showdown = require('showdown'),
      converter = new showdown.Converter()
const isNumeric = function(num) {
  return !isNaN(num)
};

const registerHelpers = function(Handlebars) {
  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  Handlebars.registerHelper('formatEpochDate', function(value){
    if(isNumeric(value)) {
      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return (new Date(value * 1000)).toLocaleDateString("en-US", options);
    }
    return value;
  });

  Handlebars.registerHelper('mdToHtml', function (value) {
    if(typeof value === 'string') {
      return converter.makeHtml(value);
    }
    console.error('mdToHtml: Input not a string')
    return value;
  })



  return Handlebars;
};

module.exports = {
  registerHelpers
}