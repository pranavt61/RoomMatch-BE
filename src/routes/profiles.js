/*
 * RoomMatch
 * @description: Profiles route handlers
 * @license: MIT
 * */

const router = require('express').Router();

const resForm = require('../util/responseFormatter');
const profilesService = require('../service/profiles');

// test route
router.get('/', (req, res) => {
  res.send('Profiles Route');
  return;
});

/*
 * Create Profile
 * Method: POST
  * */
router.post('/create', (req, res) => {
  let resObj = resForm();

  let profile = {
    user_id: req.body.user_id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    class: req.body.class,
    major: req.body.major,
    location: req.body.location,
    tags: req.body.tags,
    image: req.body.image
  };

  // TODO check for required fields
  profilesService.createProfile(profile).then((mongRes) => {
    const err = mongRes.error;

    if (err) {
      throw 'Cannot create Profile';
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

module.exports = {
  router: router
};
