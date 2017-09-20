'use strict';

const _ = require('lodash'),
    promish = require('./promish'),
    expromise = require('./expromise'),
    assertionsCtor = require('./assertions'),
    constants = require('./constants'),
    emitEvent = function (eventEmitter, eventName, context, passed, result) {
        const event = _.merge({
            notify:   eventName,
            testInfo: context.testInfo,
            dateTime: new Date()
        }, makeResult(passed, result));

        eventEmitter.emit(constants.EVENTNAME, event);
    },
    makeResult = function (passed, result) {
        switch(passed){
            case true:
            case false:
                return {passed: passed, result: result};
            default:
                return {passed: 'skipped', result: 'skipped'};
        }
    };

module.exports = function (context, eventEmitter, testCallback) {
    emitEvent(eventEmitter, 'STARTTEST', context, null);
    return expromise(resolve => {
        const TESTENDED = 'ENDTEST',
            fullContext = assertionsCtor(context, eventEmitter),
            pass = (result) => {
                const passResult = testCallback.skipped ? 'skipped' : true;
                emitEvent(eventEmitter, TESTENDED, context, passResult, result);
                resolve(_.merge({}, result, {pass: true}));
            },
            fail = (x) => {
                emitEvent(eventEmitter, TESTENDED, context, false, x);
                resolve(x);
            };

        try {
            promish(testCallback(fullContext))
                .then(result => {
                    pass(result);
                }).catch(x => {
                    fail(x);
                });
        } catch (x) {
            fail(x);
        }
    }, context.timeout);
};
