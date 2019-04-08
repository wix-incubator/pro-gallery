const express = require('express');
const path = require('path');

module.exports = async () => {
  const server = createServer(6661);

  return {
    cleanup: async () => {
      await server.close();
    }
  };
};

function createServer(port) {
  const app = express();
  const staticFilePath = path.resolve(__dirname, './storybook-static');
  app.use(express.static(staticFilePath));
  return app.listen(port);
}
