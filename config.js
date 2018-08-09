let port = process.env.PORT || 8080;
let base_link_api = 'https://api-online.cb.lk';
let base_url = 'https://online.codingblocks.com';
module.exports = {
  PORT: port,
  BASE_URL: base_url,
  COURSES_URL: `${base_url}/courses/`,
  API: {
    BASE_URL:`${base_link_api}/api/v2/`,
    COURSE_URL: `${base_link_api}/api/v2/courses/`,
    COURSE_URL_WITH_INST_RUNS: `${base_link_api}/api/v2/courses?include=instructors%2Cruns`,
    RECOMMENDED_COURSE: `${base_link_api}/api/v2/courses?filter%5Brecommended%5D=true&filter%5Bunlisted%5D=false&include=instructors%2Cruns&sort=difficulty`,
    ANNOUNCEMENTS: `${base_link_api}/api/v2/carousel_cards/`,
    COURSE_LIST: `${base_link_api}/api/v2/courses/list`
  }
}
