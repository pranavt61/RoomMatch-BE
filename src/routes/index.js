'use strict';
/**
 *  RoomMatch
 *  @description: merge routes
 *  @license: MIT
 */

const router = require('express').Router();

// Routes
const users = require('./users');

// Add routers to Router
router.use('/users', users.router);

module.exports = router;
