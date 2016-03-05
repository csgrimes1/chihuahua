'use strict';

const _ = require('lodash'),
    expromise = require('./expromise');

module.exports = function (name, descript, value, timeout) {
    return expromise(resolve => {
        resolve({
            userData: value,
            timeout: timeout || 5000,

            setTimeout: delay => {
                return _.merge({}, this, {timeout: delay});
            }
        });
    }, timeout || 10000);

    //return Promise.resolve(value).then(v => {
    //    return {
    //        userData: v,
    //        timeout: timeout || 5000,
    //
    //        setTimeout: delay => {
    //            return _.merge({}, this, {timeout: delay});
    //        }
    //    };
    //});
};
