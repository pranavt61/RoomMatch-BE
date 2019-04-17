'use strict';
/**
 *  RoomMatch
 *  @description: merge routes
 *  @license: MIT
 */

const router = require('express').Router();

// Routes
const users = require('./users');
const profiles = require('./profiles');

// Add routers to Router
router.use('/users', users.router);
router.use('/profiles', profiles.router);

module.exports = router;
