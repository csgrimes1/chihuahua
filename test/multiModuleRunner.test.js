'use strict';

const EE = require('eventemitter3'),
    mmRunner = require('../src/multiModuleRunner'),
    constants = require('../src/constants'),
    testSetup = function () {
        const eventEmitter = new EE();

        //eventEmitter.on(constants.EVENTNAME, evt => {
        //    console.log(evt);
        //});
        return {
            eventEmitter: eventEmitter
        };
    };

return (function () {
    const context = testSetup(),
        testModules = [
            '../sample/test1',
            '../sample/test2'
        ];

    mmRunner(testModules, context.eventEmitter);
}());
