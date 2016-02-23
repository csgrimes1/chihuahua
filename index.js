'use strict';

const mmRunner = require('./src/multiModuleRunner'),
    EE = require('eventemitter3'),
    _ = require('lodash');

module.exports = _.merge({}, new EE(), {
    runModules: function (files, options ) {
        return mmRunner(files, this);
    }
});

//Wire up the default events.
module.exports.on(require('./src/constants').EVENTNAME, e => {
    console.log(e);
});
