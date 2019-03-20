'use strict';
/**
 *  RoomMatch
 *  @description: Users route handlers
 *  @license: MIT
 */

// TEST
// Test object to take over database
let LAST_USER_ID = 0;
let USERS_DATA = {};

const router = require('express').Router();
const resForm = require('./responseFormatter');

router.get('/', function(req, res){
  res.send('User Route');
});

/*
 * Create User
 * Method: POST
 * Create a user with an email
 *
 * NOTE: EXCLUDE PASSWORDS
  */
router.post('/create', function(req, res){
  let resObj = resForm(null, null, null);

  // Check for email body param
  let email = req.body.email;
  if (typeof email !== 'string'
    || email.length === 0) {
    resObj.success = false;
    resObj.error = 'Email missing';
    res.status(400).json(resObj);
    return;
  } 

  // Check for correct format
  /*
  emailRegEx = new RegExp('+@u.pacific.edu'); 
  email = emailRegEx.exec(email);
  if (email == null) {
    resObj.success = false;
    resObj.error = 'Invalid email';
    res.status(400).json(resObj);
  }
  email = email[0];
  */

  // Check for unique
  if (email in USERS_DATA) {
    resObj.success = false;
    resObj.error = 'Email taken';
    res.status(400).json(resObj);
    return;
  }

  // Create user
  let userId = LAST_USER_ID ++;
  USERS_DATA[email] = {
    user_id: userId,
    email: email,
    time_created: req.start
  };

  // Success
  resObj.success = true;
  resObj.data = USERS_DATA;
  resObj.error = null;

  res.status(200).json(resObj);
});

/*
 * Authenticate a User
 * Method: GET
 * Authenticate with email
 *
 * TODO: Upgrade to JWT/Firebase
  */
router.get('/auth', function(req, res) {
  let resObj = resForm(null, null, null);

  // extract query
  let email = req.query.email;

  // Get user
  let user = USERS_DATA[email];
  if (typeof user === 'undefined') {
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Invalid Login";

    res.status(400).json(resObj);
    return;
  }

  resObj.success = true;
  resObj.data = user;
  resObj.error = null;

  res.status(200).json(resObj);
});

module.exports = {
  router: router
};
