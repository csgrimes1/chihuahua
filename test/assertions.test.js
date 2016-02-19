'use strict';

const sinon = require('sinon'),
    createContext = function () {
        return {
            fail: sinon.spy()
        };
    },
    assertionsCtor = require('../src/assertions'),
    stdAssert = require('assert'),
    EE = require('eventemitter3');

(function () {
    const context = createContext(),
        assertions = assertionsCtor(context, new EE());

    //assertions.ok(true);
    try {
        assertions.ok(false);
    }
    catch (x) {
        return;
    }
    stdAssert.ok(false);
})();

//Synchronous suite.
module.exports = Promise.resolve();