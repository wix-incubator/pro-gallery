const { Engine } = require('velocity');

const velocityData = require('./velocity.data.json');
const velocityDataPrivate = require('./velocity.private.data.json');

const engine = new Engine({ template: './src/index.vm' });

module.exports = (data) => {
  return engine.render({
    ...velocityData,
    ...velocityDataPrivate,
    ...data,
  });
};
