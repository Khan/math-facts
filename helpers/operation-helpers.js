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
    }
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
    }
  },
};

module.exports = Operations;