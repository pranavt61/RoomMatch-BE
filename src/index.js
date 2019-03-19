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
const routes = require('./routes/');

const PORT = 3000;

const start = () => {
  const app = express();

  /*
   * middleware
   */
  app.use(morgan(':method :url\t:status :response-time ms - :res[content-length]'));

  /**
   * Routes
   */
  app.use('/app/v1/', routes);

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
