'use strict';
/**
 *  RoomMatch
 *  @description: Response Formatter to normalize responses
 *  @license: MIT
 */

const resFormatter = function(success, data, error) {

  return {
    success: success || null,
    data: data || null,
    error: error || null
  };
};

module.exports = resFormatter;
