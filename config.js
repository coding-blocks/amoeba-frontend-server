let port = process.env.PORT || 8080;
let base_link_api = 'http://localhost:3000';
let base_url = 'https://online.codingblocks.com';
module.exports = {
  PORT: port,
  BASE_URL: base_url,
  COURSES_URL: `${base_url}/courses/`,
  API: {
    BASE_URL:`${base_link_api}/api/v2/`,
    COURSE_URL: `${base_link_api}/api/v2/courses/`,
    COURSE_URL_WITH_INST_RUNS: `${base_link_api}/api/v2/courses?exclude=ratings%2Cinstructors.*&filter%5Bunlisted%5D=false&include=instructors%2Cruns&page%5Blimit%5D=8&page%5Boffset%5D=0`,
    RECOMMENDED_COURSE: `${base_link_api}/api/v2/courses?exclude=ratings%2Cinstructors.*%2Cfeedbacks%2Cruns.*&filter%5Brecommended%5D=true&filter%5Bunlisted%5D=false&include=instructors%2Cruns&page%5Blimit%5D=12&sort=difficulty`,
    ANNOUNCEMENTS: `${base_link_api}/api/v2/carousel_cards?sort=order`,
    COURSE_LIST: `${base_link_api}/api/v2/courses/list`
  }
}
