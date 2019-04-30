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

module.exports = {
  router: router
};
