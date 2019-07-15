let port = process.env.PORT || 8080;
let base_link_api = 'http://localhost:3000';
let base_url = 'https://online.codingblocks.com';
module.exports = {
  PORT: port,
  BASE_URL: base_url,
  COURSES_URL: `${base_url}/courses/`,
  PRERENDER: {
    PORT: 3001,
    TIMEOUT: 60 * 1000
  },
  API: {
    BASE_URL:`${base_link_api}/api/v2/`,
    COURSE_URL: `${base_link_api}/api/v2/courses/`,
    COURSE_URL_WITH_INST_RUNS: `${base_link_api}/api/v2/courses`,
    RECOMMENDED_COURSE: `${base_link_api}/api/v2/courses`,
    ANNOUNCEMENTS: `${base_link_api}/api/v2/carousel_cards`,
    COURSE_LIST: `${base_link_api}/api/v2/courses/list`,
    COURSE_RATINGS: `${base_link_api}/api/v2/ratings/course/`
  }
}
