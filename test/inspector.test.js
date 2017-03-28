'use strict';

const inspect = require('../src/inspector'),
    assert = require('assert');

(function () {
    assert.equal(inspect('a:', 2, 'b:', 3).text, 'a: 2 b: 3');
    inspect('log', 1).log();
    inspect('warn', 2).warn();
    inspect('error', 1).error();
    inspect.withOptions({depth: 2}, {a: {b: 1234, c: module}}).log();
})();

module.exports = Promise.resolve();
