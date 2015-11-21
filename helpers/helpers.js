'use strict';

const printTime = (time) => {
  return parseFloat(time/1000).toFixed(2).toString() + 's';
};

const randomIntBetween = function(min, max) {
  return Math.floor(Math.random()*(max - min + 1)) + min;
};

const shuffle = function(arr) {
  // Modified from: http://stackoverflow.com/a/6274381
  for (let j, x, i = arr.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = arr[i - 1];
    arr[i - 1] = arr[j];
    arr[j] = x;
  }
  return arr;
};

const softShuffle = function(arr, blockSize, offset) {
  // Takes an array and shuffles blocks of values so things don't move too
  // far from their original location.
  blockSize = blockSize || arr.length;
  offset = offset || 0;

  let newArr = [];
  for (let i = offset; i < arr.length; i += blockSize) {
    const arrayBlock = arr.slice(i, i + blockSize);
    const shuffledBlock = shuffle(arr.slice(i, i + blockSize));
    newArr = newArr.concat(shuffledBlock);
  }
  return newArr;
};

module.exports = {
  printTime: printTime,
  randomIntBetween: randomIntBetween,
  shuffle: shuffle,
  softShuffle: softShuffle,
};
