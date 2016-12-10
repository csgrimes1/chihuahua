'use strict';

const stdAssert = require('assert'),
    cfix = require('../src/circular-fix'),
    tests = [
        () => {
            let circ = {a: {b: {c: null}}};
            circ.a.b.c = circ;

            const final = cfix(circ);

            console.log(JSON.stringify(final));
        }

    ].map(foo => {
        try {
            return Promise.resolve(foo());
        } catch (x) {
            return Promise.reject(x);
        }
    });


module.exports = Promise.all(tests);