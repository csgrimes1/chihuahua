'use strict';

const EXPECTEDVAL = 2112,
    SUITE = 'test1',
    DESCRIPT = 'demo test suite';
let loadCount = 0;

loadCount++;

module.exports = {
    numberOfLoads: () => { return loadCount; },

    beforeTest: t => {
        //Anything passed as 3rd arg will be wrapped in a promise.
        //If it is a promise, it will be left as is per
        //Promise.resolve(...);
        return t.createContext(SUITE, DESCRIPT, EXPECTEDVAL);
    },

    tests: {
        'description 1': context => {
            context.equal(context.userData, EXPECTEDVAL);
        },
        'description 2': context => {
            context.ok(true, 'always passes');
            context.equal(loadCount, 1, 'load count must be 1');
        }
    }
};
