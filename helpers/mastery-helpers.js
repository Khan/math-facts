'use strict';

import _ from 'underscore';

import ColorHelpers from '../helpers/color-helpers';
import OperationHelpers from '../helpers/operation-helpers';

// The time to recall a fact from memory should be less than 800ms
const MEMORY_TIME = 800;

// From /webapp/stylesheets/shared-package/variables.less
const masteryColors = {
  unknown: '#dddddd',
  struggling: '#c30202',
  introduced: '#9cdceb',
  practiced: '#29abca',
  mastered: '#1c758a',
};

const masteryTextColors = {
  unknown: '#5d5d5d',
  struggling: '#ffdfdf',
  introduced: '#124653',
  practiced: '#0C3842',
  mastered: '#f7feff',
};

const masteryTitle = {
  unknown: 'Not Practiced',
  struggling: 'Tricky',
  introduced: 'Just Started',
  practiced: 'Almost there',
  mastered: 'Mastered',
};

const masteryDescription = {
  unknown: `You haven't answered this one yet!`,
  struggling: `This fact isn't as fast as your other ones. You'll get there! Keep practicing!`,
  introduced: `We need to practice this one a few more times!`,
  practiced: `We need to get this one to be a little faster!`,
  mastered: `You know this fact from memory.`,
};

const getLearnerTypingTimes = function(factData, operation) {
  const oneDigitTimes = [];
  const twoDigitTimes = [];
  let count = 0;
  _.each(factData, (rowData, row) => {
    _.each(rowData, (data, col) => {
      const answer = OperationHelpers[operation].getAnswer([row, col]);
      const numberLength = answer.toString().length;
      _.each(data, (timeData) => {
        // TODO: check if the data is recent (throw out really old times)
        if (timeData.hintUsed) {
          // Don't include typing times when hints were used
          return;
        }
        if (numberLength === 1) {
          oneDigitTimes.push(timeData.time);
          count++;
        } else if (numberLength === 2) {
          twoDigitTimes.push(timeData.time);
          count++;
        }
      });
    });
  });

  // Find bottom quartile of each set
  function median(values) {
    values.sort((a,b) => {
      return a - b;
    });
    const half = Math.floor(values.length/2);

    if (values.length % 2) {
      return values[half];
    }
    else {
      return (values[half - 1] + values[half]) / 2.0;
    }
  }
  const lowerQuartileOneDigit = median(
    oneDigitTimes.slice(0, median(oneDigitTimes)));
  const lowerQuartileTwoDigit = median(
    twoDigitTimes.slice(0, median(twoDigitTimes)));
  if (count > 10) {
    return [
      lowerQuartileOneDigit,
      lowerQuartileTwoDigit - lowerQuartileOneDigit
    ];
  }
  // without enough data, assume their typing speed is some random numbers:
  return [800, 300];
};

const getTypingTime = function(number, learnerTypingTimes) {
  // For a given number estimate the time in ms it takes this learner to
  // type it.
  const numberLength = number.toString().length;
  const oneDigitTime = learnerTypingTimes[0];
  const typingTime = oneDigitTime + learnerTypingTimes[1] * numberLength;
  return typingTime;
};

const getTimeBonus = function(time, number, learnerTypingTimes, hintUsed) {
  if (hintUsed) {
    return 1;
  }
  // For a given number estimate the time in ms it takes this learner to
  // type it.
  const typingTime = getTypingTime(number, learnerTypingTimes);
  return time < typingTime + MEMORY_TIME ? 20 :
    time < typingTime + MEMORY_TIME * 2 ? 5 :
    1;
};

/**
 * Given data about a particular math fact, determine the fact's mastery level
 *
 */
const isFluent = function(number, time, learnerTypingTimes) {
  // TODO: Maybe add another level of "quick but not fluent"?
  if (time < getTypingTime(number, learnerTypingTimes) + MEMORY_TIME) {
    return true;
  } else {
    return false;
  }
};
const getFactStatus = function(number, times, learnerTypingTimes) {
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

  const numTries = times != null ? times.length : 0;

  if (numTries === 0) {
    return 'unknown';
  }

  let fluentTimes = 0;
  let nonFluentTimes = 0;

  // Only use the 10 most recent times
  const recentTimes = times.slice(-10);
  _.each(recentTimes, (timeData) => {
    if (timeData.hintUsed) {
      return;
    }
    const time = timeData.time;
    // TODO: Only take into account the most recent times, but specifically
    // take into account times over the past few days to check for long-term
    // retention.

    // TODO: Maybe add another level of "quick but not fluent"?
    const fluent = isFluent(number, time, learnerTypingTimes);
    if (fluent) {
      fluentTimes++;
    } else {
      nonFluentTimes++;
    }
  });

  if (numTries < 4) {
    return 'introduced';
  }

  // If the learner has shown fluency on this fact more than 75% of the time,
  // we can consider them fluent.
  if (fluentTimes >= nonFluentTimes * 2) {
    // fluent overall
    return 'mastered';
  }


  // If they have more nonFluent than fluent facts, or have tried this fact
  // a bunch of times and aren't at mastery yet, assume they need some help.
  if (fluentTimes <= nonFluentTimes || nonFluentTimes > 4) {
    // non-fluent
    return 'struggling';
  }

  // working on it
  return 'practiced';

};


module.exports = {
  masteryColors: masteryColors,
  masteryTextColors: masteryTextColors,
  masteryTitle: masteryTitle,
  masteryDescription: masteryDescription,

  getTypingTime: getTypingTime,
  getLearnerTypingTimes: getLearnerTypingTimes,
  isFluent: isFluent,
  getFactStatus: getFactStatus,
  getTimeBonus: getTimeBonus,
};
