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
const matches = require('./matches');

// Add routers to Router
router.use('/users', users.router);
router.use('/profiles', profiles.router);
router.use('/matches', matches.router);

module.exports = router;
