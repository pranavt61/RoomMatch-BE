'use strict';
/**
 *  RoomMatch
 *  @description: Users route handlers
 *  @license: MIT
 */

const router = require('express').Router();

router.get('/', function(req, res){

  let resObj = {
    msg: 'HELLO USERS'
  };

  res.status(200).json(resObj);
});

module.exports = {
  router: router
};
