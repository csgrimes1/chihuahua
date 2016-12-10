'use strict';

const circular = '<<circular reference>>',
    maxDepthMsg = '<<max depth reached>>',
    _ = require('lodash'),
    fixCircular = function (obj, maxDepth) {
        let references = new Set();
        const visitor = (x, depth) => {
            if (depth >= maxDepth) {
                return maxDepthMsg;
            } else if (typeof x !== 'object') {
                return x;
            } else if (references.has(x)) {
                return circular;
            }

            references.add(obj);
            const pairs = _.toPairs(x)
                .map(pair => {
                    return [pair[0], visitor(pair[1], depth + 1)];
                });

            return _.fromPairs(pairs);
        };

        return visitor(obj, 0);
    };

module.exports = function (obj, maxDepth) {
    return fixCircular(obj, maxDepth);
};
