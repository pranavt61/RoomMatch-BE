#!/usr/bin/env node
/**
 *  @(Project): RoomMatch Backend
 *  @(Filename): profiles.js
 *  @(Description): MongoDB functions for User Schema
 *  @(License): MIT
 */

/**
 *  App Dependencies
 */
const MongoClient = require('mongodb').MongoClient;
const MongoObjectID = require('mongodb').ObjectID;

const resForm = require('../util/responseFormatter');

// Link to Mongo Service
const MongoSrc = require('./MongoSrc.js');

async function createProfile(profile) {
  let resObj = resForm();

  // query command
  let query = {
    user_id: new MongoObjectID(profile.user_id),
    firstname: profile.firstname,
    lastname: profile.lastname,
    age: profile.age,
    gender: profile.gender,
    class: profile.class,
    major: profile.major,
    location: profile.location,
    tags: profile.tags,
    image: profile.image
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');
    const res = await db.collection('profiles').insertOne(query);
    await client.close();

    // Success
    console.log('Success: saved profile to database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot create Profile");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// update profile
async function updateProfile(profile) {
  let resObj = resForm();

  // filter command
  let filter = {
    user_id: new MongoObjectID(profile.user_id)
  };

  // query command
  let query = {
    user_id: new MongoObjectID(profile.user_id),
    firstname: profile.firstname,
    lastname: profile.lastname,
    age: profile.age,
    gender: profile.gender,
    class: profile.class,
    major: profile.major,
    location: profile.location,
    bio: profile.bio,
    tags: profile.tags,
    image: profile.image
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');
    const res = await db.collection('profiles').updateOne(filter, { $set : query });
    await client.close();

    // Success
    console.log('Success: updated profile to database')
    resObj.success = true;
    resObj.data = res;
    resObj.error = null;
    return resObj;
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot updated Profile");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// Get single profile by user_id
async function getProfileByUser(user_id) {
  let resObj = resForm();

  // save image to cloudinary

  // query command
  let query = {
    user_id: new MongoObjectID(user_id)
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');
    const res = await db.collection('profiles').findOne(query);
    await client.close();

    if (res) {
      console.log('Success: retrieved profile from database')

      // profile found
      resObj.success = true;
      resObj.data = res;
      resObj.error = null;
      return resObj;
    } else {
      // profile not found
      resObj.success = false;
      resObj.data = null;
      resObj.error = "No profile found";
      return resObj;
    }
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot retrieve Profile");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}

// Get many profiles by user_ids
async function getManyProfiles(user_ids) {
  let resObj = resForm();

  let ids = []
  for (let i = 0; i < user_ids.length; i ++) {
    ids.push(new MongoObjectID(user_ids[i]));
  }

  console.log(ids);

  // query command
  let query = {
    user_id: { $in: ids }
  };

  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');
    const res = await db.collection('profiles').find(query).toArray();
    await client.close();

    if (res) {
      console.log('Success: retrieved many profiles from database')

      // profile found
      resObj.success = true;
      resObj.data = res;
      resObj.error = null;
      return resObj;
    } else {
      // profile not found
      resObj.success = false;
      resObj.data = null;
      resObj.error = "No profile found";
      return resObj;
    }
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot retrieve Profile");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }
}
// Get a profile that the user has not swiped on yet
async function getProfileNext(user_id, n) {
  let resObj = resForm();

  // query command
  let swipe_query = {
    from_user_id: new MongoObjectID(user_id)
  };

  // defined after swipe query
  let profile_query = {};
  
  try {
    const client = await MongoClient.connect(MongoSrc);
    const db = client.db('RoomMatch');

    // get array of user_ids that requesting user has already swiped on
    let swipe_res = await db.collection('swipes').find(swipe_query)
                              .map((s) => s.to_user_id).toArray();

    // add this user_id to filter
    swipe_res.push(new MongoObjectID(user_id));

    profile_query = {
      user_id: {
        // not in
        $nin: swipe_res
      }
    };
    
    const res = await db.collection('profiles').find(profile_query).limit(Number(n)).toArray();

    await client.close();

    if (res) {
      console.log('Success: retrieved profile from database')

      // profile found
      resObj.success = true;
      resObj.data = res;
      resObj.error = null;
      return resObj;
    } else {
      // profile not found
      resObj.success = false;
      resObj.data = null;
      resObj.error = "No profile found";
      return resObj;
    }
  } catch(err) {
    // Fail
    console.log("ERROR: Cannot retrieve Profile");
    console.log(err);
    resObj.success = false;
    resObj.data = null;
    resObj.error = err;
    return resObj;
  }

}

module.exports = {
  createProfile: createProfile,
  updateProfile: updateProfile,
  getProfileByUser: getProfileByUser,
  getProfileNext: getProfileNext,
  getManyProfiles: getManyProfiles
};
