module.exports = {
  puppeteerOptions: {
    devtools: true
  },
  setup: require.resolve('./perfer-setup'),
  sites: [{
    name: 'root',
    url: 'http://localhost:6661'
  }],
  bundleSize: {
    files: ['./dist/statics/*.js']
  }
};
