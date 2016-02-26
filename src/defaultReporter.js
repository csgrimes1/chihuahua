'use strict';

const EE = require('eventemitter3'),
    _ = require('lodash'),
    colors = require('colors/safe');

module.exports = function report (log) {
    const events = new EE(),
        dumpLogs = function (node) {
            const eventData = _.chain(node)
                .omit('children')
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
    events.on('MODULE', data => {
        console.log(`  ${data.module}`);
    });
    events.on('TEST', data => {
        count++;
        if (data.passed) {
            passed++;
        }
        console.log(colors[data.passed ? 'green' : 'red'](`    ${data.testInfo.test}  (${data.elapsedMS} MS)`));
    });
    dumpLogs(log);
};
