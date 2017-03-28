#!/usr/bin/env node

'use strict';

const _ = require('lodash'),
    buffer = require('buffer'),
    api = require('./index'),
    childProc = require('child_process'),
    path = require('path'),
    colors = require('colors/safe'),
    commands = {
        newtest: cmdLine => {
            try {
                const scriptPath = path.join(__dirname, 'src/newtest.sh'),
                    buffer = childProc.execFileSync(scriptPath, cmdLine.files.slice(1));

                console.log(buffer.toString());
            } catch (x) {
                const stderr = x.stderr.toString(),
                    stdout = x.stdout.toString(),
                    output = stderr ? stderr : stdout;

                console.error(output);
                return x.status;
            }
        }
    },
    isCommand = function (cmdLine) {
        const file = cmdLine.files && cmdLine.files[0] || '';

        return Object.keys(commands).indexOf(file) >= 0 ? file : undefined;
    };

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

    const command = isCommand(cl);
    if (command) {
        const handler = commands[command];

        process.exit(handler(cl));
    } else {
        return api.runModules(cl.files, cl.flags);
    }
})
    .then(ec => {
        process.exit(ec);
    })
    .catch((x) => {
    if (x.message !== 'FAILED_TESTS') {
        if (_.isError(x)) {
            console.log(colors.red(`Error during test load or beforeTest: ${x.stack ? x.stack : x}`));
        } else {
            console.log(colors.red(`Error during test load or beforeTest: ${require('util').inspect(x)}`));
        }
        process.exit(126);
    }
    process.exit(1);
});
