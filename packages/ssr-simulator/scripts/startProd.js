/* eslint-disable no-console */
process.env.NODE_ENV = 'production';
process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

const cluster = require('cluster');

const { app } = require('../build/server');

const PORT = process.env.PORT || 3000;

// Use the native Node.js cluster module to create a worker processes for each CPU
if (cluster.isMaster) {
  console.log(`Master pid: ${process.pid}`);

  const cpuCount = require('os').cpus().length;
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, err => {
    if (err) {
      return console.error(err);
    }

    console.info(
      `Server running on port ${PORT} -- Worker pid: ${
        cluster.worker.process.pid
      }`
    );
  });
}
