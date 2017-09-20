'use strict';

const promish = require('../src/promish'),
    bluebird = require('bluebird'),
    assert = require('assert'),
    okResult = 'ok',
    badResult = 'error',
    promises = [
        (function () {
            const p = bluebird.resolve(okResult);
            const pRes = promish(p);
            assert(pRes instanceof Promise);
            assert.notEqual(p, pRes);

            return pRes.then(value => {
                assert.equal(value, okResult);
            });
        })(),
        (function () {
            const p = bluebird.reject(badResult);
            const pRes = promish(p);
            assert(pRes instanceof Promise);
            assert.notEqual(p, pRes);

            return pRes
                .then(() => {
                    assert(false);
                })
                .catch(err => {
                    assert.equal(err, badResult);
                });
        })(),
        (function () {
            const p = Promise.resolve(okResult);
            const pRes = promish(p);
            assert.equal(p, pRes);

            return pRes.then(value => {
                assert.equal(value, okResult);
            });
        })(),
        (function () {
            const p = Promise.reject(badResult);
            const pRes = promish(p);
            assert.equal(p, pRes);

            return pRes
                .then(() => assert(false))
                .catch(value => {
                    assert.equal(value, badResult);
                });
        })(),
        (function () {
            const pRes = promish(null);
            assert(pRes instanceof Promise);
            return pRes
                .then(value => assert.equal(value, null));
        })(),
        (function () {
            const pRes = promish(undefined);
            assert(pRes instanceof Promise);
            return pRes
                .then(value => assert.equal(value, undefined));
        })(),
        (function () {
            const pRes = promish(1234);
            assert(pRes instanceof Promise);
            return pRes
                .then(value => assert.equal(value, 1234));
        })()
    ];

module.exports = Promise.all(promises);
