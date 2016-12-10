#!/usr/bin/env node

const fs = require('fs'),
    _ = require('lodash'),
    scripts = _.filter(fs.readdirSync(__dirname), fname => {
        return fname.match(/.+\.test\.js/);
    }),
    promises = _.map(scripts, (fname) => {
        console.log(`Running test ${fname}`);
        return require(`./${fname}`);
    });

Promise.all(promises)
    .catch(x => {
        console.error(`TEST FAILURE: ${x}\n${x.stack}`);
        process.exit(1);
    });
