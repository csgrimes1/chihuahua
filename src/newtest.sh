#!/usr/bin/env bash

if [ $# -lt 2 ]; then
    echo "$(dirname $0) TESTDIR TESTNAME [FORMAT]"
    echo "  TESTDIR directory relative to project root"
    echo "  TESTNAME filename of test. Example: foo.test, footests/bar.test.js"
    echo "  FORMAT is optional. When BARE, it creates a minimal, bare test file."
    exit 1
fi

read -r -d '' TESTCODE << EOF
'use strict';

module.exports = {
    beforeTest: t => {
        const timeout = 1000,
            promise = new Promise(resolve => {
                setTimeout(() => resolve(1 + 2), 500);
            });
        //Anything passed as 3rd arg will be wrapped in a promise using Promise.resolve(...).
        //Per Promise.resolve's semantics, the parameter can be a promise or a non-promise.
        return t.createContext('shortname', 'long description', promise, timeout);
    },

    afterTest: context => {
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    },

    tests: {
        'description 1': context => {
            return new Promise(resolve => {
                setTimeout(()=> {
                    context.equal(context.userData, 3);
                    resolve();
                }, 500);
            });
        },
        'description 2': context => {
            const testResult = context.userData + 1,
                expectedValue = 4;

            context.ok(true, 'always passes');
            context.equal(testResult, expectedValue, 'expect a result of 4');
        }
    }
};
EOF

read -r -d '' BARECODE << EOF
'use strict';

module.exports = {
    beforeTest: t => {
        const userData = {};

        return t.createContext('shortname', 'long description', userData, 5000/*timeout/ms*/);
    },

    afterTest: context => {
    },

    tests: {
        'description 1': context => {
        }
    }
};
EOF

if [ "$3" == "BARE" ]; then
    TESTCODE=$BARECODE
elif [ "$3" == "bare" ]; then
    TESTCODE=$BARECODE
fi

TESTDIR=$(cd $(npm root)/.. && pwd)/$1
FILENAME=$(basename $2 .js)
PATHNAME="$TESTDIR/$FILENAME.js"

if [ -f "$PATHNAME" ]; then
    echo "$PATHNAME already exists."
    exit 1
fi
echo $PATHNAME
echo "$TESTCODE" > $PATHNAME
