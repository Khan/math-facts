'use strict';

var _ = require('underscore');

var ColorHelpers = require('./ColorHelpers.ios');

// The time to recall a fact from memory should be less than 800ms
var MEMORY_TIME = 800;

// From /webapp/stylesheets/shared-package/variables.less
var masteryColors = {
  unknown: '#dddddd',
  struggling: '#c30202',
  introduced: '#9cdceb',
  practiced: '#29abca',
  mastered: '#1c758a',
};

var masteryTextColors = {
  unknown: '#5d5d5d',
  struggling: '#ffdfdf',
  introduced: '#124653',
  practiced: '#0C3842',
  mastered: '#f7feff',
};

var masteryDescription = {
  unknown: 'You haven\'t answered this fact yet.',
  struggling: 'You\'re having trouble with this fact.',
  introduced: 'You haven\'t answered this fact enough times.',
  practiced: 'You have answered this fact quickly sometimes.',
  mastered: 'You know this fact from memory.',
};


var getTypingTime = function(number) {
  // For a given number estimate the time in ms it takes this learner to
  // type it.

  // TODO: Customize times per user using and average of their fastest times as
  // the floor on their typing time.
  var numberLength = number.toString().length;
  var oneDigitTime = 800;
  var typingTime = oneDigitTime + 300 * numberLength;
  return typingTime;
};

/**
 * Given data about a particular math fact, determine the fact's mastery level
 *
 */
var getFactStatus = function(number, times) {
  // times is an array of the learner's time data for this fact in the form:
  // [ {time: 1200, date: 19346832, hintUsed: true},
  //   {time: 1000, date: 19346832, hintUsed: false},
  //    ... ]


  // When a learner first starts out, we don't have any idea which facts
  // they know and which they don't. We can guess at which facts are easier
  // than others and rank them in order, but we need to actually go through
  // and test each fact to determine this learner's fluency for each fact.

  // We can classify each fact as FLUENT, NOT-FLUENT, UNKNOWN, or LEARNING

  // Fluent: The learner has memorized this fact: they can recall it from
  //         memory in less than 800 ms (accounting for typing time). They
  //         consistently answer this fact quickly, but what we really want
  //         look at is the past few times (e.g. answered 3 out of the last
  //         4 in less than 800ms) and eventually some data on whether this
  //         fact is in short-term or long-term memory (i.e. have they
  //         answered this fact consistently in the past X days).

  // Non-Fluent: This learner has not memorized this fact: it takes longer
  //         800ms to recall this fact from memory, which we have determined
  //         via > 4 piecies of data where the time to respond was >800ms
  //         more than half the time.

  // Unknown: This fact has been asked < 5 times so we don't know if it's
  //         a fluent fact or not.

  // Learning: We're introducing this fact via spaced repetition. This fact
  //         will be mixed in with fluent facts in the following pattern:
  //          L F L F F L F F F L F F F F L F F F F F L F F F F F F L ...
  //         to attempt to work the fact into long-term memory.
  //         TODO: When does the fact become "fluent"?

  var numTries = times != null ? times.length : 0;

  if (numTries === 0) {
    return 'unknown';
  }

  var fluent = 0;
  var nonFluent = 0;

  _.each(times, (timeData) => {
    var time = timeData.time;
    // TODO: Only take into account the most recent times, but specifically
    // take into account times over the past few days to check for long-term
    // retention.

    // Ignore broken times of 0 seconds
    if (time > 0) {

      // TODO: Maybe add another level of "quick but not fluent"?
      if (time < getTypingTime(number) + MEMORY_TIME) {
        fluent++;
      } else {
        nonFluent++;
      }
    }
  });

  // If the learner has shown fluency on this fact more than 75% of the time,
  // we can consider them fluent.
  if (fluent > 3 && fluent > nonFluent * 3) {
    // fluent
    return 'mastered';
  }

  if (numTries < 4 && fluent > nonFluent) {
    return 'introduced';
  }

  if (fluent > nonFluent) {
    // working on it
    return 'practiced';
  }

  // non-fluent
  return 'struggling';

};


module.exports = {
  masteryColors: masteryColors,
  masteryTextColors: masteryTextColors,
  masteryDescription: masteryDescription,

  getFactStatus: getFactStatus
};
