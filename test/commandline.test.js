'use strict';

const parseCommandLine = require('../src/commandline'),
    assert = require('assert'),
    defaults = {
        files: [
            {
                name: 'SCRIPT',
                required: true,
                description: 'The script to run.'
            },
            {
                name: 'FILEARG1',
                required: true,
                description: 'Optional file.'
            },
            {
                name: 'FILEARG2',
                required: false,
                description: 'Optional file.'
            }
        ],
        flags: {
            foo:      {
                options:      'yes|no',
                defaultValue: 'yes',
                alias:        'f'
            },
            someFlag: {
                options:      'true|false',
                defaultValue: false,
                alias:        's'
            }
        }
    };

(function () {
    const cl = parseCommandLine(['node', '-x', '--', 'index', '---', '-foo=no', 'bar', 'barr'], defaults);

    assert.equal(cl['$0'], 'index');
    assert.equal(cl.flags.foo, 'no');
    console.log(cl.flags.someFlag, 'false');
}());

(function () {
    try {
        const cl = parseCommandLine(['node', '-x', '--', 'index', '---', '-foo=no', 'bar'], defaults);
        assert(false, 'should not reach this line');
    } catch (x) {
    }
}());

(function () {
    try {
        const cl = parseCommandLine(null, defaults);
        assert(false, 'should not reach this line');
    } catch (x) {
    }
}());

module.exports = Promise.resolve();
