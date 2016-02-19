'use strict';

const createContext = require('../src/context'),
    stdAssert = require('assert');

module.exports = (function () {
    const expectedContextValue = 1234;

    return createContext('context suite', '', expectedContextValue).then(newContext => {
        stdAssert.equal(newContext.userData, expectedContextValue);
    }).catch(x => {
        stdAssert.ok(false, x);
    });
})();
