'use strict';

import _ from 'underscore';

import ColorHelpers from '../helpers/color-helpers';
import Helpers from '../helpers/helpers';
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
  mastered: `You know this fact from memory! You did it!`,
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

const getGoalTime = function(number, learnerTypingTimes) {
  return getTypingTime(number, learnerTypingTimes) + MEMORY_TIME;
};

const getTimeBonus = function(time, number, learnerTypingTimes, hintUsed) {
  if (hintUsed) {
    return 1;
  }
  // For a given number estimate the time in ms it takes this learner to
  // type it.
  const goalTime = getGoalTime(number, learnerTypingTimes);
  return time <= goalTime ? 20 :
    time <= goalTime * 2 ? 5 :
    1;
};

/**
 * Given data about a particular math fact, determine the fact's mastery level
 *
 */
const isFluent = function(number, time, learnerTypingTimes) {
  // TODO: Maybe add another level of "quick but not fluent"?
  if (time <= getGoalTime(number, learnerTypingTimes)) {
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

const addToInputList = function(operation, factData, inputList, propsTimeData, studyFact, spacer) {
  const OperationHelper = OperationHelpers[operation];

  const easiestFacts = OperationHelper.getEasiestFactOrder();
  const max = 10;

  const questionSeeds = [];

  const learnerTypingTimes = getLearnerTypingTimes(
    propsTimeData,
    operation
  );

  // Populate question seeder with data about facts that have already been
  // practiced
  _.each(_.range(0, max + 1), (row) => {
    questionSeeds[row] = [];
    if (factData[row] == null) {
      factData[row] = [];
    }
    _.each(_.range(0, max + 1), (col) => {
      const timeData = factData[row][col];
      const answer = OperationHelper.getAnswer([row, col]);
      const factStatus = getFactStatus(answer, timeData,
        learnerTypingTimes);
      questionSeeds[row][col] = factStatus;
    });
  });

  const fluentFacts = [];
  const nonFluentFacts = [];
  const unknownFacts = [];

  const pushFact = function(fact) {
    const left = fact[0];
    const right = fact[1];
    const fluency = questionSeeds[left][right];
    if (fluency === 'mastered') {
      fluentFacts.push(fact);
    } else if (fluency === 'struggling') {
      nonFluentFacts.push(fact);
    } else {
      unknownFacts.push(fact);
    }
  };

  _.each(easiestFacts, (fact) => {
    pushFact(fact);
    if (fact[0] !== fact[1]) {
      // Include the flipped fact if it's distinct (e.g. 2 + 1 and 1 + 2)
      pushFact([fact[1], fact[0]]);
    }
  });

  // TODO: update factData on the fly so we can have the most up-to-date
  // view of which facts are fluent/not

  // TODO: make sure there are enough facts for this quiz
  if (unknownFacts.length > 0) {
    // We don't have enough data about this user, so ask them unknown facts.
    if (unknownFacts.length < 10) {
      // If we have too few unknown facts, pad the questions with some facts
      // that we know are fluent, making sure that everything is shuffled.
      inputList = inputList.concat(Helpers.shuffle(
        unknownFacts.concat(
          Helpers.shuffle(fluentFacts).slice(0, 10 - unknownFacts.length)
      )));
    } else {
      // If we're pullling from pretty much all the facts, give the easier
      // facts first. The blockSize comes from figuring out approximately
      // where the facts go from being easy to hard.
      inputList = inputList.concat(Helpers.softShuffle(unknownFacts, 60));
    }
  } else if (nonFluentFacts.length > 0) {
    // We know whether this learner is fluent or not fluent in each fact.
    // We want to pick one struggling fact as the learning fact and use
    // spaced repetition to introduce it into long term memory.

    // TODO: Check something to do with long term memory?

    if (studyFact.length === 0) {
      // We get to choose the study fact! Pick the next easiest fact that we
      // don't know.
      studyFact = nonFluentFacts[0];
    }

    // We're introducing this fact via spaced repetition. This fact will be
    // mixed in with fluent facts in the following pattern:
    //    L F L F F L F F F L F F F F L F F F F F L F F F F F F L ...
    // to attempt to work the fact into long-term memory.

    inputList = inputList.concat([studyFact])
      .concat(Helpers.shuffle(fluentFacts).slice(0, spacer));

    spacer = spacer + 1;
  } else {
    // This learner is fluent in everything! Let them practice to their
    // heart's content.
    inputList = inputList.concat(Helpers.shuffle(fluentFacts));
  }

  return {
    inputList: inputList,
    spacer: spacer + 1,
  };
};


module.exports = {
  masteryColors: masteryColors,
  masteryTextColors: masteryTextColors,
  masteryTitle: masteryTitle,
  masteryDescription: masteryDescription,

  getGoalTime: getGoalTime,
  getLearnerTypingTimes: getLearnerTypingTimes,
  isFluent: isFluent,
  getFactStatus: getFactStatus,
  getTimeBonus: getTimeBonus,
  addToInputList: addToInputList,
};
