'use strict';

const _ = require('lodash'),
    assertionsCtor = require('./assertions'),
    constants = require('./constants'),
    emitEvent = function (eventEmitter, eventName, context, passed, result) {
        eventEmitter.emit(constants.EVENTNAME, _.merge({
            notify:   eventName,
            testInfo: context.testInfo,
            dateTime: new Date()
        }, makeResult(passed, result)));
    },
    makeResult = function (passed, result) {
        switch(passed){
            case true:
            case false:
                return {passed: passed, result: result};
            default:
                return {};
        }
    };

module.exports = function (context, eventEmitter, testCallback) {
    emitEvent(eventEmitter, 'TESTSTARTED', context, null);
    return new Promise((resolve) => {
        const TESTENDED = 'TESTENDED',
            timerId = setTimeout(() => {
                const err = new Error('TIMEOUT');

                emitEvent(eventEmitter, TESTENDED, context, false, err);
                resolve(err);
            }, context.timeout),
            fullContext = assertionsCtor(context, eventEmitter),
            pass = (result) => {
                emitEvent(eventEmitter, TESTENDED, context, true, result);
                clearTimeout(timerId);
                resolve(_.merge({}, result, {pass: true}));
            },
            fail = (x) => {
                emitEvent(eventEmitter, TESTENDED, context, false, x);
                clearTimeout(timerId);
                resolve(x);
            };

        try {
            Promise.resolve(testCallback(fullContext))
                .then(result => {
                    pass(result);
                }).catch(x => {
                    fail(x);
                });
        } catch (x) {
            fail(x);
        }
    });
};
