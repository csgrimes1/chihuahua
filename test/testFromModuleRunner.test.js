'use strict';

const moduleTest = require('../src/testFromModuleRunner'),
    moduleName = '../spec/test1',
    EE = require('eventemitter3'),
    eventEmitter = new EE();

module.exports =
(function () {
    return moduleTest(moduleName, 0, eventEmitter)
        .then(() => {
            return moduleTest(moduleName, 1, eventEmitter);
        });
})();
