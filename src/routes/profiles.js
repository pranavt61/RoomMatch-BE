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

  let user_id = req.body.user_id;

  let profile = {
    user_id: req.body.user_id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    gender: req.body.gender,
    class: req.body.class,
    major: req.body.major,
    location: req.body.location,
    bio: req.body.bio,
    tags: req.body.tags,
    image: req.body.image
  };

  // TODO check for required fields
  
  // check for existing 
  profilesService.getProfileByUser(user_id).then((mongRes) => {
    const err = mongRes.error;

    console.log("ERR");
    console.log(JSON.stringify(mongRes));

    if (err === null) {
      // Profile for user exists
      return profilesService.updateProfile(profile);
    }

    return profilesService.createProfile(profile);
  }).then((mongRes) => {
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


/*
 * Get Profile by user_id
 * Method: GET
  * */
router.get('/getByUserId', (req, res) => {
  let resObj = resForm();

  let user_id = req.query.user_id;
  console.log('ID ' + user_id);

  profilesService.getProfileByUser(user_id).then((mongRes) => {
    const err = mongRes.error;

    if (err) {
      throw 'Cannot retrieve Profile';
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
