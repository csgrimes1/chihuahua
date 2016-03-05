'use strict';

const TIMEOUT_ERROR = 'TIMEOUT';

module.exports = function (callback, timeout) {
    let succeed,
        fail,
        p = new Promise((resolve, reject) => {
            let done = false;

            succeed = result => {
                if (!done) {
                    resolve(result);
                    done = true;
                    clearTimeout(id);
                }
            };
            fail = err => {
                if (!done) {
                    reject(err);
                    done = true;
                    clearTimeout(id);
                }
            };
            const id = setTimeout(() => {
                fail(new Error(TIMEOUT_ERROR));
            }, timeout || 10000);

            callback(resolve, reject);
        });

    p.exresolve = (result) => {
        succeed(result);
        return p;
    };
    p.exreject = (err) => {
        fail(err);
        return p;
    };
    return p;
};

module.exports.TIMEOUT_ERROR = TIMEOUT_ERROR;
