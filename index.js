'use strict';

const mmRunner = require('./src/multiModuleRunner'),
    EE = require('eventemitter3'),
    _ = require('lodash');
let log;

module.exports = _.merge({}, new EE(), {
    runModules: function (files, options ) {
        log = [];
        return mmRunner(files, this).then(res => {
            //Write the log...
            console.log(log);
            return res;
        });
    }
});

//Wire up the default events.
module.exports.on(require('./src/constants').EVENTNAME, e => {
    //console.log(`===================> ${JSON.stringify(e)}`);
    log.push(e);
});
