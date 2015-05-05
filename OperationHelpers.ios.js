'use strict';

var _ = require('underscore');

var Operations = {
  noop: {
    getSign: function(): string {
      return '';
    },
    getAnswer: function(input): number {
      return input;
    },
    getQuestion: function(input): string {
      return input.toString();
    },
    getExpression: function(input): string {
      return input.toString();
    }
  },

  addition: {
    getSign: function(): string {
      return '+';
    },
    getAnswer: function(inputs): number {
      var sum = 0;
      _.each(inputs, (input) => {
        sum += input;
      });
      return sum;
    },
    getQuestion: function(inputs): string {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3);
    },
    getExpression: function(inputs): string {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3) + ' = ' + this.getAnswer(inputs);
    }
  },

  multiplication: {
    getSign: function(): string {
      return 'x';
    },
    getAnswer: function(inputs): number {
      var product = 1;
      _.each(inputs, (input) => {
        product *= input;
      });
      return product;
    },
    getQuestion: function(inputs): string {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3);
    },
    getExpression: function(inputs): string {
      var expression = '';
      _.each(inputs, (input) => {
        expression += input + ' ' + this.getSign() + ' ';
      });
      return expression.slice(0, -3) + ' = ' + this.getAnswer(inputs);
    }
  },
};

module.exports = Operations;