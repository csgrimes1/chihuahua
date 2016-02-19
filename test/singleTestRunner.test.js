'use strict';

const createContext = require('../src/context'),
    stdAssert = require('assert'),
    runner = require('../src/singleTestRunner'),
    EE = require('eventemitter3'),
    eventEmitter = new EE(),
    promises = [
        (function () {
            const expectedValue = 999,
                context = createContext('str', '', expectedValue);

            return context.then(c => {
                return runner(c, eventEmitter, c2 => {
                    c2.equal(expectedValue, c2.userData);
                });
            });
        })(),

        (function () {
            const expectedValue = 1999,
                context = createContext('str', '', 0);

            return context.then(c => {
                return runner(c, eventEmitter, c2 => {
                    c2.equal(expectedValue, c2.userData);
                    stdAssert.ok(false, 'should not reach this assert');
                }).catch(x => {
                    stdAssert.ok(true, 'should reach this assert');
                });
            });
        })(),

        (function () {
            const context = createContext('str', '');

            return context.then(c => {
                return runner(c.setTimeout(20), eventEmitter, c2 => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                        }, 200);
                    })
                }).then(() => {
                    stdAssert.ok(false, 'should time out rather than reaching this assert');
                }).catch(() => {
                });
            });
        })()
    ];

module.exports = Promise.all(promises);