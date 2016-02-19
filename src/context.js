'use strict';

const _ = require('lodash');

module.exports = function (name, descript, value) {
    return Promise.resolve(value).then(v => {
        return {
            userData: v,
            timeout: 5000,

            setTimeout: delay => {
                return _.merge({}, this, {timeout: delay});
            }
        };
    });
};
