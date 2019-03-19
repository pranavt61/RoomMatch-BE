'use strict';
/**
 *  RoomMatch
 *  @description: Response Formatter to normalize responses
 *  @license: MIT
 */

const resFormatter = function(success, data, error) {

  return {
    success: success,
    data: data,
    error: error
  };
};

module.exports = resFormatter;
