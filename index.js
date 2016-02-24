'use strict';

const mmRunner = require('./src/multiModuleRunner'),
    EE = require('eventemitter3'),
    _ = require('lodash'),
    reportDriver = require('./src/reportDriver'),
    makePushNode = function (e, children) {
        const summaryFor = e.notify.substr(5);

        return _.merge({}, _.omit(e, ['notify']), {summaryFor: summaryFor, children: children});
    };

module.exports = _.merge({}, new EE(), {
    runModules: function (files, options ) {
        //Copy events...
        const keys = _.keysIn(new EE()),
            events = _.pick(module.exports, keys);

        let log, stack;
        //Wire up the default events.
        events.on(require('./src/constants').EVENTNAME, e => {
            let top;
            switch(e.notify){
                case 'STARTSUITE':
                    log = top = makePushNode(e, []);
                    stack = [top];
                    break;
                case 'STARTMODULE':
                case 'STARTTEST':
                {
                    const parent = _.last(stack);
                    top = makePushNode(e, []);
                    parent.children.push(top);
                    stack.push(top);
                }
                    break;
                case 'ASSERTION':
                {
                    const parent = _.last(stack);
                    top = makePushNode(e);
                    parent.children.push(top);
                }
                    break;
                case 'ENDTEST':
                case 'ENDMODULE':
                case 'ENDSUITE':
                    if (e.dateTime) {
                        let top = _.last(stack);

                        top.elapsedMS = e.dateTime.getTime()
                            - top.dateTime.getTime();
                    }
                    stack.splice(stack.length -1, 1);
                    break;
            }
        });
        return mmRunner(files, events).then(res => {
            //Write the log...
            reportDriver(log, options);
            return res;
        });
    }
});

