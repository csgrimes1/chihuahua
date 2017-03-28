'use strict';

const fs = require('fs'),
    path = require('path'),
    appRoot = require('app-root-path'),
    requirify = function (moduleName) {
        return path.isAbsolute(moduleName) ? moduleName : path.join(appRoot.toString(), moduleName);
    },
    mkdirp = function (dir) {
        console.log(`dir to make: ${dir}`);
        if (fs.existsSync(dir)){
            return;
        }
        fs.mkdirSync(dir);
    };


module.exports = function save (log, options) {
    const outputDir = requirify(options.outputDir),
        outputFile = path.join(outputDir, 'testresults.json');

    mkdirp(outputDir);
    fs.writeFileSync(outputFile, JSON.stringify(log, null, 2));
};
