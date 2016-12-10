'use strict';

const stdAssert = require('assert'),
    cfix = require('../src/circular-fix'),
    tests = [
        () => {
            let circ = {a: {b: {c: null}}};
            circ.a.b.c = circ;

            const final = cfix(circ, 10);

            console.log(JSON.stringify(final));
        },

        () => {
            const obj = {a: {b: {c: { d: {}}}}},
                final = cfix(obj, 2);

            console.log(JSON.stringify(final));
            stdAssert.deepEqual(final, {a: {b: '<<max depth reached>>'}}, 'should cap depth');
        }
    ].map(foo => {
        try {
            return Promise.resolve(foo());
        } catch (x) {
            return Promise.reject(x);
        }
    });


module.exports = Promise.all(tests);