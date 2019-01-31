const express = require('express');

const PORT = 3000;

const start = () => {
  const app = express();

  app.get('/', (req, res) => res.send('Hello Express'));

  app.listen(PORT, () => {console.log("Serving on port " + PORT + "...")});
};

module.exports = {
  start: start
};
