'use strict';

const _ = require('lodash');

module.exports = function (name, descript, value, timeout) {
    return Promise.resolve(value).then(v => {
        return {
            userData: v,
            timeout: timeout || 5000,

            setTimeout: delay => {
                return _.merge({}, this, {timeout: delay});
            }
        };
    });
};
