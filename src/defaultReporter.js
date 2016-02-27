'use strict';

const EE = require('eventemitter3'),
    _ = require('lodash'),
    colors = require('colors/safe'),
    util = require('util'),
    reformatError = function (error) {
        const keepLines = 4,
            tab = '    ',
            stackLines = error.stack.replace('\r', '')
            .split('\n')
            //Skip over the message
            .slice(1),
            stack = stackLines.slice(0, keepLines)
                .map(line => `${tab}${line}`)
                .join('\n')
                    + (stackLines.length > keepLines ? `\n${tab}    ...` : '');

        return `      Error: ${error.message}\n${stack}`;
    };

module.exports = function report (log) {
    const events = new EE(),
        makePassFailRollup = function (nodes) {
            return {
                count: nodes.length,
                passes: _.filter(nodes, node => node.passed).length
            };
        },
        dumpLogs = function (node) {
            const rollup = _.isArray(node.children)
                    ? makePassFailRollup(node.children)
                    : {},
                eventData = _.chain(node)
                    .omit('children')
                    .merge(rollup)
                    .value();

            events.emit(node.summaryFor, eventData);
            if (node.children) {
                node.children.forEach(dumpLogs);
            }
            events.emit(`AFTER-${node.summaryFor}`, eventData);
        };
    let count = 0, passed = 0;

    events.on('SUITE', data => {
        console.log(colors.bold(`${data.dateTime} START RUN`));
    });
    events.on('AFTER-SUITE', data => {
        const color = passed < count ? 'red' : 'green';

        console.log(colors.bold(colors[color](`${data.dateTime} ${passed} of ${count} tests passed  (${data.elapsedMS} MS)`)));
    });
    events.on('MODULE', evt => {
        console.log(colors.bold(colors[evt.passed ? 'green' : 'red'](`  ${evt.module}`)));
    });
    events.on('TEST', evt => {
        count++;
        console.log(colors[evt.passed ? 'green' : 'red']
            (`    ${evt.passed ? '*PASS' : '*FAIL'}  ${evt.testInfo.test}  (${evt.elapsedMS} MS)`));
    });
    events.on('AFTER-TEST', evt => {
        if (evt.passed) {
            passed++;
        } else if (evt.passes >= evt.count) {
            console.log(colors.red(reformatError(evt.result)));
        }
    });
    events.on('ASSERTION', evt => {
        if (!evt.passed) {
            const args = util.inspect(evt.args, {level: 4}),
                prettyArgs = args.substr(1, args.length - 2);

            console.log(colors.red(`      Assertion ${JSON.stringify(evt.assertionFunction)}(${prettyArgs}) failed`));
        }
    });
    dumpLogs(log);
};
