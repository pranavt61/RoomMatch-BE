#!/usr/bin/env node

/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): index.js
 *  @(Description): Backend services for mobile clients
 *  @(License): MIT
 */

/**
 *  App Dependencies
 */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes/');

const PORT = 3000;

const start = () => {
  const app = express();

  /*
   * middleware
   */
  const morgan_format = ':method :url\t:status :response-time ms - :res[content-length]';
  app.use(morgan(morgan_format));
  app.use(bodyParser.json());                                           // x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));

  /**
   * Routes
   */
  app.use('/v1/', routes);

  /**
   * Error Handlers
   */
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use(function(err, req, res, next) {
    // Render the error page
    res.status(err.status || 500);
    res.json({error: "error"});
  });

  app.listen(PORT, () => {console.log("Serving on port " + PORT + "...")});
};

module.exports = {
  start: start
};
