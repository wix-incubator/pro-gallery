

module.exports = async function () {
  // close the browser instance
  await global.__BROWSER_GLOBAL__.close();
  console.log('teardown ===================');
};