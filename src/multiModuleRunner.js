'use strict';

const proxyquire = require('proxyquire').noPreserveCache(),
    _ = require('lodash'),
    constants = require('./constants'),
    degent = require('degent'),
    runner = require('./testFromModuleRunner'),
    loadModuleInfos = function (modules) {
        return _.map(modules, (m) => {
            const imports = proxyquire(m, {}),
                testCount = _.keys(imports.tests).length;

            return {module: m, testCount: testCount};
        });
    },
    runTests = function(module, testCount, eventEmitter) {
        eventEmitter.emit(constants.EVENTNAME, {
            notify:    'STARTMODULE',
            module:    module,
            dateTime:  new Date(),
            testCount: testCount
        });
        let passes = 0;
        return degent( function *() {
            for (let n = 0; n < testCount; n++) {
                let result = yield runner(module, n, eventEmitter);
                if(!_.isError(result)){
                    passes++;
                }
            }

            eventEmitter.emit(constants.EVENTNAME, {
                notify:    'ENDMODULE',
                module:    module,
                dateTime:  new Date(),
                testCount: testCount,
                passes:    passes
            });
        });
    },
    runModules = function (moduleInfos, eventEmitter) {
        return degent( function *() {
            for(let n=0; n<moduleInfos.length; n++) {
                let mi = moduleInfos[n];
                yield runTests(mi.module, mi.testCount, eventEmitter);
            }
        });
    };

module.exports = function (modules, eventEmitter) {
    const moduleInfos = loadModuleInfos(modules);

    runModules(moduleInfos, eventEmitter);
};
