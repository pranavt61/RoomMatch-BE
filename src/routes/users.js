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

const resForm = require('../util/responseFormatter');
const userService = require('../service/users');

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
  let resObj = resForm();

  // Check for email body param
  const email = req.body.email;
  if (typeof email !== 'string'
    || email.length === 0) {
    resObj.success = false;
    resObj.error = 'Email missing';
    res.status(400).json(resObj);
    return;
  } 
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

  // Create user
  userService.createUser(email).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      // Fail
      resObj.success = false;
      resObj.data = null;
      resObj.error = err;
      res.status(400).json(resObj);
      return;
    } else {
      // Success
      resObj.success = true;
      resObj.data = null;
      resObj.error = null;
      res.status(200).json(resObj);
      return;
    }
  }).catch((err) => {
    console.log("CREATE USER ERROR");
    console.log(err);

    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Cannot create user";
    res.status(400).json(resObj);
    return;
  });
});

/*
 * Authenticate a User
 * Method: GET
 * Authenticate with email
 *
 * TODO: Upgrade to JWT/Firebase
  */
router.get('/auth', function(req, res) {
  let resObj = resForm();

  // extract query
  let email = req.query.email;

  // Get user
  userService.getUser(email).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      // Fail
      resObj.success = false;
      resObj.data = null;
      resObj.error = err;
      res.status(400).json(resObj);
      return;
    } else {
      // Success
      resObj.success = true;
      resObj.data = mongRes.data;
      resObj.error = null;
      res.status(200).json(resObj);
      return;
    }
  }).catch((err) => {
    console.log("AUTH ERROR");
    console.log(err);

    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Cannot auth user";
    res.status(400).json(resObj);
    return;
  });
});

router.get('/delete', function(req,res) {
  let resObj = resForm();

  let id = req.query.id;

  userService.deleteUser(id).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      // Fail
      resObj.success = false;
      resObj.data = null;
      resObj.error = err;
      res.status(400).json(resObj);
      return;
    } else {
      // Success
      resObj.success = true;
      resObj.data = null;
      resObj.error = null;
      res.status(200).json(resObj);
      return;
    }
  }).catch((err) => {
    console.log("DELETE USER ERROR");
    console.log(err);

    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Cannot delete user";
    res.status(400).json(resObj);
    return;
  });
});

module.exports = {
  router: router
};
