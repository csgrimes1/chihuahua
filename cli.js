#!/usr/bin/env node

'use strict';

const _ = require('lodash'),
    buffer = require('buffer'),
    api = require('./index');

(function () {
    return new Promise(resolve => {
        let data = null;
        const self = process.stdin;

        self.on('readable', function() {
            var chunk = this.read();
            if (chunk === null && !data) {
                resolve();
            } else if (!data) {
                data = chunk;
            } else if (chunk) {
                data = buffer.Buffer.concat([chunk]);
            }
        });
        self.on('end', function() {
            resolve(data.toString().replace('\r', '').split('\n'));
        });
    });
}())
.then(data => {
    const commandLine = require('./src/commandline'),
        clDefaults = {
            files: [{
                name: 'TESTSCRIPT',
                required: !data,
                description: 'One or more test modules to run'
            }],
            flags: {
                outputDir: {
                    options: 'directory relative to project root',
                    defaultValue: './.testresults'
                },
                consoleOutput: {
                    options: 'when true, allows console output of results',
                    defaultValue: 'true'
                }
            }
        },
        cl0 = commandLine(process.argv, clDefaults),
        cl = _.merge({}, cl0, {
            files: data ? data.concat(cl0.files || []).filter(s => s) : cl0.files
        });

    return api.runModules(cl.files, cl.flags);
}).catch((x) => {
    if (x.message !== 'FAILED_TESTS') {
        console.error(`${x.stack}`);
    }
    process.exit(1);
});
