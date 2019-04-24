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

// upload profile image to DB
async function createProfileImage(image) {
  let resObj = resForm();

}

module.exports = {
  createProfile: createProfile,
  updateProfile: updateProfile,
  getProfileByUser: getProfileByUser
};
