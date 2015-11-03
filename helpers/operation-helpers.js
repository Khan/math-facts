'use strict';

import _ from 'underscore';

var Operations = {
  noop: {
    getSign: function() {
      return '';
    },
    getAnswer: function(input): number {
      return input;
    },
    getQuestion: function(input) {
      return input.toString();
    },
    getExpression: function(input) {
      return input.toString();
    }
  },

  addition: {
    getSign: function() {
      return '+';
    },
    getAnswer: function(inputs): number {
      var sum = 0;
      _.each(inputs, (input) => {
        sum += input;
      });
      return sum;
    },
    getQuestion: function(inputs) {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3);
    },
    getExpression: function(inputs) {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3) + ' = ' + this.getAnswer(inputs);
    },
    getEasiestFactOrder: function() {
      return [
        // +1s
        [1, 1],
        [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
          [7, 1], [8, 1], [9, 1], [10, 1],

        // +0s
        // [0, 0], [1, 0],
        // [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
        //   [7, 0], [8, 0], [9, 0], [10, 0],

        // +2s
        [2, 2],
        [1, 2], [3, 2], [4, 2], [5, 2], [6, 2],
          [7, 2], [8, 2], [9, 2], [10, 2],

        // 5 + smalls
        [5, 1], [5, 2], [5, 3], [5, 4],

        // little doubles
        [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],

        // 10+s
        [10, 10],
        [10, 2], [10, 3], [10, 4], [10, 5], [10, 6],
          [10, 7], [10, 8], [10, 9],

        // pairs that make 10
        [9, 1], [8, 2], [7, 3], [6, 4],

        // pairs that make 11
        [9, 2], [8, 3], [7, 4], [6, 5],

        // big doubles
        [6, 6], [7, 7], [8, 8], [9, 9], [10, 10],

        // 9+s
        [9, 2], [9, 3], [9, 4], [9, 5], [9, 6],
          [9, 7], [9, 8], [9, 9],

        // leftovers
        [4, 3], [6, 3], // the little ones

        [8, 4], [8, 6], // even, even, even!
        [6, 7], [7, 8], // the weird ones
        [7, 5], [8, 5], // adding 5
      ];
    },
  },

  multiplication: {
    getSign: function() {
      return '×';
    },
    getAnswer: function(inputs): number {
      var product = 1;
      _.each(inputs, (input) => {
        product *= input;
      });
      return product;
    },
    getQuestion: function(inputs) {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3);
    },
    getExpression: function(inputs) {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3) + ' = ' + this.getAnswer(inputs);
    },
    getEasiestFactOrder: function() {
      return [
        // x1s
        [1, 1],
        [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
          [7, 1], [8, 1], [9, 1], [10, 1],

        // x0s
        // [0, 0], [1, 0], [2, 0],
        // [3, 0], [4, 0], [5, 0], [6, 0],
        //   [7, 0], [8, 0], [9, 0], [10, 0],

        // x2s
        [2, 2],
        [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2],

        // x10s
        [10, 10],
        [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9],

        // x5s
        [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],

        // x9s
        [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],

        // squares
        [3, 3], [4, 4], [6, 6], [7, 7], [8, 8], [10, 10],

        // x3s
        [3, 4], [3, 6], [3, 7], [3, 8],

        // x4s
        [4, 6], [4, 7], [4, 8],

        // leftovers
        [6, 7], [6, 8], [7, 8],

      ];
    },
  },
};

module.exports = Operations;