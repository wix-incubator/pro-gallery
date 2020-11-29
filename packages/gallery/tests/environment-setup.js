const env = process.env.TEST_ENVIRONMENT;
const baseUrl = env === 'ssr' ? 'http://localhost:3001' : 'http://localhost:3000';

module.exports = {
  baseUrl: baseUrl
}