'use strict';

const inspect = require('util').inspect,
    colors = require('colors/safe');

function _inspector (items, opts) {
    const fullOptions = Object.assign({
            outputTarget: console,
            depth: 2
        }, opts),
        text = items
            .map(item =>
                typeof item === 'string'
                    ? item
                    : inspect(item, fullOptions)
            )
            .join(' ');

    return {
        text: text,
        log: () => fullOptions.outputTarget.log(colors.blue(text)),
        warn: () => fullOptions.outputTarget.warn(colors.yellow(text)),
        error: () => fullOptions.outputTarget.error(colors.magenta(text))
    }
}

function inspector () {
    return _inspector(Array.from(arguments), {});
}

Object.assign(inspector, {
    withOptions: function (opts) {
        const args = Array.from(arguments).slice(1);
        return _inspector(args, opts);
    }
});

module.exports = inspector;