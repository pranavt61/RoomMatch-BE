/**
 *  RoomMatch
 *  @description: Users route handlers
 *  @license: MIT
 */

const router = require('express').Router();

const resForm = require('../util/responseFormatter');
const usersService = require('../service/users');

router.get('/', function(req, res){
  return res.send('User Route');
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
  let email = req.body.email;
  let password = req.body.password;
  if (typeof email !== 'string'
    || email.length === 0) {
    resObj.success = false;
    resObj.error = 'Email missing';
    return res.status(200).json(resObj);
  } 

  // check for u.pacific.edu email
  let reg = new RegExp('.+@u\.pacific\.edu');
  let match = reg.exec(email);

  if (match === null) {
    // not vaild email
    resObj.success = false;
    resObj.data = null;
    resObj.error = 'Invalid Email';
    return res.status(200).json(resObj);
  }
  email = match[0];

  usersService.getUser(email).then((mongRes) => {
    const err = mongRes.error;

    if (err == null) {
      // User already exists
      throw 'Email taken';
    }

    return usersService.createUser(email);
  }).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      throw 'Cannot create user';
    } else {
      // Success
      resObj.success = true;
      resObj.data = null;
      resObj.error = null;
      return res.status(200).json(resObj);
    }
  }).catch((err) => {
    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return res.status(200).json(resObj);
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
  usersService.getUser(email).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      // Fail
      resObj.success = false;
      resObj.data = null;
      resObj.error = err;
      return res.status(200).json(resObj);
    } else {
      // Success
      resObj.success = true;
      resObj.data = mongRes.data;
      resObj.error = null;
      return res.status(200).json(resObj);
    }
  }).catch((err) => {
    console.log("AUTH ERROR");
    console.log(err);

    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Cannot auth user";
    return res.status(200).json(resObj);
  });
});

router.get('/delete', function(req,res) {
  let resObj = resForm();

  let id = req.query.id;

  usersService.deleteUser(id).then((mongRes) => {
    const err = mongRes.error;
    if (err) {
      // Fail
      resObj.success = false;
      resObj.data = null;
      resObj.error = err;
      return res.status(200).json(resObj);
    } else {
      // Success
      resObj.success = true;
      resObj.data = null;
      resObj.error = null;
      return res.status(200).json(resObj);
    }
  }).catch((err) => {
    console.log("DELETE USER ERROR");
    console.log(err);

    // Fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = "Cannot delete user";
    return res.status(200).json(resObj);
  });
});

module.exports = {
  router: router
};
