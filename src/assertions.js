'use strict';

const _ = require('lodash'),
    assert = require('assert'),
    constants = require('./constants');

module.exports = function (context, eventEmitter) {
    //Collect all the functions in the assert module
    const assertApi = _.pick(assert, _.functions(assert));

    return _.merge({}, context, _.mapValues(assertApi, (stdAssert, name) => {
        return function () {
            const args = _.toArray(arguments),
                self = this,
                eventNotify = 'ASSERTION';

            try{
                stdAssert.apply(null, args);
                eventEmitter.emit(constants.EVENTNAME, {
                    notify:            eventNotify,
                    testInfo:          context.testInfo,
                    assertionFunction: name,
                    args:              args,
                    passed:            true
                });
            } catch( x ) {
                eventEmitter.emit(constants.EVENTNAME, {
                    notify:            eventNotify,
                    testInfo:          context.testInfo,
                    assertionFunction: name,
                    args:              args,
                    passed:            false,
                    error:             x
                });
                throw x;
            }
        };
    }));
};
