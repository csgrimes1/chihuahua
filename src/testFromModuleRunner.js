'use strict';

const proxyquire = require('proxyquire').noPreserveCache(),
    _ = require('lodash'),
    contextCreator = require('./context'),
    beforeTestApi = {
        createContext: contextCreator
    },
    singleTestRunner = require('./singleTestRunner'),
    expromise = require('./expromise');

module.exports = function (module, testIndex, eventEmitter) {
    const testModule = proxyquire(module, {}),
        targetTestName = _.keys(testModule.tests)[testIndex],
        testFunction = testModule.tests[targetTestName];

    return testModule.beforeTest(beforeTestApi)
        .then(ctx => {
            const context = _.merge({}, ctx, {
                testInfo: {
                    module: module,
                    test:   targetTestName
                }
            });

            return singleTestRunner(context, eventEmitter, testFunction)
                .then(() => {
                    return context;
                });
        }).then(context => {
            if (typeof testModule.afterTest === 'function') {
                return expromise( resolve => {
                    resolve(testModule.afterTest(context));
                }, context.timeout);
            }
        });
};
