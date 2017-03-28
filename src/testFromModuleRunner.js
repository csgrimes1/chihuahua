'use strict';

const
    _ = require('lodash'),
    contextCreator = require('./context'),
    inspect = require('./inspector'),
    beforeTestApi = {
        createContext: contextCreator,
        inspect: inspect
    },
    singleTestRunner = require('./singleTestRunner'),
    expromise = require('./expromise'),
    skippedTest = Object.assign(() => {}, {skipped: true});

module.exports = function (module, testIndex, eventEmitter) {
    const testModule = require(module),
        targetTestName = _.keys(testModule.tests)[testIndex],
        testFunction =targetTestName.toLowerCase().startsWith('skip!')
            ? skippedTest
            : testModule.tests[targetTestName];

    return testModule.beforeTest(beforeTestApi)
        .then(ctx => {
            //The userData field may be a promise, and we need to wait on it.
            return Promise.resolve(ctx.userData)
                .then(userData => {
                    return _.merge({},
                        ctx,
                        {userData: userData}
                    );
                });
        }).then(ctx => {
            const context = _.merge({}, ctx, {
                testInfo: {
                    module: module,
                    test:   targetTestName
                },
                inspect: inspect
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
