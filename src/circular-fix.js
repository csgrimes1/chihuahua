'use strict';

const circular = '<<circular reference>>',
    _ = require('lodash'),
    fixCircular = function (obj) {
        let references = new Set();
        const visitor = x => {
            if (typeof x !== 'object') {
                return x;
            } else if (references.has(x)) {
                return circular;
            }

            references.add(obj);
            const pairs = _.toPairs(x)
                .map(pair => {
                    return [pair[0], visitor(pair[1])];
                });

            return _.fromPairs(pairs);
        };

        return visitor(obj);
    };

module.exports = function (obj) {
    return fixCircular(obj);
};
