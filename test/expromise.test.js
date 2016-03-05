'use strict';

const expromise = require('../src/expromise'),
    assert = require('assert'),
    okResult = 'ok',
    badResult = 'error',
    promises = [
        (function () {
            return expromise(resolve => resolve(okResult))
                .then(result => {
                    assert.equal(result, okResult);
                });
        })(),

        (function () {
            return expromise((r, reject) => {
                reject(badResult);
            })
            .then(() => {
                assert.ok(false);
            })
            .catch(result => {
                assert.equal(result, badResult);
            });
        })(),
        (function () {
            return expromise(resolve => {})
                .exresolve(okResult)
                .then(result => {
                    assert.equal(result, okResult);
                });
        })(),

        (function () {
            return expromise(() => {
            })
            .exreject(badResult)
            .then(() => {
                assert.ok(false);
            })
            .catch(result => {
                assert.equal(result, badResult);
            });
        })(),

        (function () {
            let timerId = 0;

            return expromise(resolve => {
                timerId = setTimeout(resolve, 20000);
            }, 20)
                .then(() => {
                    assert.fail('Should not reach here.');
                })
                .catch(x => {
                    assert.equal(x.message, expromise.TIMEOUT_ERROR);
                })
                .then(() => {
                    clearTimeout(timerId);
                });
        })()
    ];

module.exports = Promise.all(promises);
