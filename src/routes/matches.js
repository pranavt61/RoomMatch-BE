/**
 *  RoomMatch
 *  @description: Matches route handlers
 *  @license: MIT
 */

const router = require('express').Router();

const resForm = require('../util/responseFormatter');
const profilesService = require('../service/profiles');

router.get('/', function(req, res){
  return res.send('Matches Route');
});

router.post('/create', function(req, res) {
  let resObj = resForm();


});

module.exports = {
  router: router
};
