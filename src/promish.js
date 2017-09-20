'use strict';

function isFunction (thing) {
    return typeof thing === 'function';
}

function isNil (thing) {
    return thing === null || thing === undefined;
}

module.exports = function resolveToPromise (target) {
    if (target instanceof Promise) {
        return target;
    }
    if (isNil(target)) {
        return Promise.resolve(target);
    }
    if (isFunction(target.then) && isFunction(target.catch)) {
        return new Promise((resolve, reject) => {
            return target
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }
    return Promise.resolve (target);
};
