'use strict';

const _ = require('lodash'),
    path = require('path'),
    parseFlag = function (flagInfo) {
        const nameFields = (flagInfo.name || '').split('=');

        return nameFields.length === 1
            ? _.merge({}, flagInfo, {
                    name: flagInfo.name ? camelCase(flagInfo.name) : undefined,
                    value: true
                })
            : _.merge({}, flagInfo, {name: camelCase(nameFields[0]), value: nameFields[1]})
    },
    getFlag = function (arg) {
        const reggie = /(\-+)(\S+)*/,
            match = reggie.exec(arg);

        if (!match) {
            return null;
        }
        return match.length > 2
            ? parseFlag({flag: arg, name: match[2]})
            : null;
    },
    skipFlags = function (argv) {
        //Move past 'node' and the subsequent flags.
        const rawArgs = argv.slice(1),
            firstNonFlagIndex = _.findIndex(rawArgs, arg => {
                return getFlag(arg) ? false : true;
            });

        return rawArgs.slice(firstNonFlagIndex);
    },
    sliceArgs = function (argv) {
        const aliases = require('../package.json').bin;

        if (aliases[argv[0]]) {
            return argv;
        }
        return skipFlags(argv);
    },
    listArgs = function (files) {
        const file = files[0],
            start = file.required ? '' : '[',
            end = file.required ? '' : ']';

        return `${start}${file.name}${files.length <= 1 ? '' : ' ' + listArgs(files.slice(1))}${end}`;
    },
    printInfo = function (script, defaults) {
        console.log(`$ ${script} ${listArgs(defaults.files)}`);

        defaults.files.forEach(file => {
            console.log(`\t${file.name}: ${file.description}`);
        });
        _.toPairs(defaults.flags).forEach(pair => {
            const name = unCamel(pair[0]),
                info = pair[1],
                alias = info.alias ? ` | -${info.alias} "${info.defaultValue}"` : '';

            console.log(`\t"--${name}=${info.defaultValue}"${alias}\t\n\t\tDefault:\t"${info.defaultValue}"`);
            console.log(`\t\tOptions:\t${info.options}`);
        });
    },
    camelCase = function (arg) {
        const tokens = arg.split('-'),
            t2 = tokens.slice(0, 1).concat(
                tokens.slice(1).map(tok => {
                    return tok.substr(0, 1).toUpperCase()
                        + tok.substr(1).toLowerCase();
                })
            );

        return t2.join('');
    },
    unCamel = function(arg) {
        const walk = function *() {
            for (const ch of arg) {
                if (ch === ch.toUpperCase()) {
                    yield '-';
                }
                yield ch.toLowerCase();
            }
        };

        return Array.from(walk()).join('');
    };

/* Watch for the following patterns:
    1. path/node -flag1 -flag2 script arg1 arg2
       => script arg1 arg2
    2. alias arg1 arg2
       where alias is from package.json in the bin property.
 */
module.exports = function (argv, defaults) {
    const effectiveDefaults = _.merge({flags: {}, files: {}}, defaults || {});

    try {
        const args2 = _.filter(sliceArgs(argv || []), arg => {
                const flag = getFlag(arg);

                return flag ? flag.name : true;
            }),
            dflags = defaults ? (defaults.flags || {}) : {},
            flags = _.chain(args2)
                .map(getFlag)
                .filter(f => {
                    return f && f.name;
                })
                .map(f => [f.name, f.value])
                .fromPairs()
                .value(),
            files = _.filter(args2.slice(1), arg => {
                return !getFlag(arg);
            }),
            reqdCount = _.takeWhile(effectiveDefaults.files, f => f.required).length;

        if (files.length < reqdCount) {
            throw new Error(`${reqdCount} parameters(s) expected; ${files.length} provided`);
        }

        return {
            $0: args2[0],
            flags: _.merge(_.mapValues(dflags, flags => flags.defaultValue), flags),
            files: files
        };
    } catch (x) {
        console.error(x);
        printInfo('SCRIPT', effectiveDefaults);
        throw x;
    }
};
