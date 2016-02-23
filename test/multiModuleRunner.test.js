'use strict';

const EE = require('eventemitter3'),
    mmRunner = require('../src/multiModuleRunner'),
    testSetup = function () {
        const eventEmitter = new EE();

        return {
            eventEmitter: eventEmitter
        };
    };

return (function () {
    const context = testSetup(),
        testModules = [
            'spec/test1',
            'spec/test2'
        ];

    mmRunner(testModules, context.eventEmitter);
}());
