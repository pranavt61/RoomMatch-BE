/**
 *  RoomMatch
 *  @description: Matches route handlers
 *  @license: MIT
 */

const router = require('express').Router();

const resForm = require('../util/responseFormatter');
const matchesService = require('../service/matches');

router.get('/', function(req, res){
  return res.send('Matches Route');
});

router.post('/create', function(req, res) {
  let resObj = resForm();

  let swipe = {
    from_user_id: req.body.from_user_id,  // from user
    to_user_id: req.body.to_user_id,      // to user
    like: req.body.like                   // like or dislike : true or false
  };

  matchesService.createSwipe(swipe).then((mongRes) => {
    const err = mongRes.error;

    if (err) {
      throw 'Cannot create Swipe';
    } else {
      // Success
      resObj.success = true;
      resObj.data = mongRes.data;
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

router.get('/get', function(req, res) {
  let resObj = resForm();

  let user_id = req.query.user_id;
  
  matchesService.getMatches(user_id).then((mongRes) => {
    const err = mongRes.error;

    if (err) {
      throw 'Cannot get matches';
    } else {
      // success
      resObj.success = true;
      resObj.data = mongRes.data;
      resObj.error = null;
      return res.status(200).json(resObj);
    }
  }).catch((err) => {
    // fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return res.status(200).json(resObj);
  });
});

router.get('/getChat', (req, res) => {
  let resObj = resForm();

  let match_id = req.query.match_id;
  
  matchesService.getChat(match_id).then((mongRes) => {
    // success
    resObj.success = true;
    resObj.data = mongRes.data;
    resObj.error = null;
    return res.status(200).json(resObj);
  }).catch((err) => {
    // fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return res.status(200).json(resObj);
  });
});

router.post('/addChat', (req, res) => {
  let resObj = resForm();

  const match_id = req.body.match_id;
  const user_id = req.body.user_id;
  const message = req.body.message;

  matchesService.addChat(match_id, user_id, message).then((mongRes) => {
    const err = mongRes.error;

    if (err) {
      throw 'Cannot add chat';
    } else {
      // success
      resObj.success = true;
      resObj.data = mongRes.data;
      resObj.error = null;
      return res.status(200).json(resObj);
    }
  }).catch((err) => {
    // fail
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return res.status(200).json(resObj);
  });
});

module.exports = {
  router: router
};
