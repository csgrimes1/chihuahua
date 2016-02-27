# Pizza Rat
Lightweight unit test library inspired by a viral video:

[![PIZZA RAT!](http://img.youtube.com/vi/UPXUG8q4jKU/0.jpg)](http://www.youtube.com/watch?v=UPXUG8q4jKU)

Did you click on it? Was that not amazing?! It shows that something small can carry a big load.

Most (if not all) unit test modules are frameworks rather than libraries. Pizza Rat is a small footprint
module meant to do big things.

Pizza Rat does one thing well: it runs tests. When complete, the results are stored as an intuitive block
of JSON in a configurable folder. This library does not contain any reporters; more about that shortly...


#### Small Can Be Powerful

Our friend the Pizza Rat can carry something that may exceed his or her body weight!

Small is good with NPM modules. In the day and age of microservices, we often create ironically large dependency
trees in the node_modules folder. It's easy to see how this happens. For Pizza Rat to behave deterministically,
the dependencies in package.json must be hard versions. For example, `lodash 4.5.0` is referenced rather
than `lodash ^4.5.0`. If Pizza Rat references another module that references a different, hard version
of `lodash`, then the tree grows. Perhaps the tree grows for insignificant reasons, such as a new but
unused function. It's at the programmer's discretion whether to host a large dependency tree. However, Pizza
Rat should not __impose__ slow NPM installs on the developer. If you are Dockerizing
your Node application, you'll endure significant wait times with NPM install already. It's good to
keep the node_modules tree trimmed!

This library is small, and here is why:

1. The CLI finds tests using STDIN rather than a glob expression. Nothing against globs, but glob libraries
bring many nested dependencies, adding weight to the package. It's quite easy to pipe the ```ls``` command
to Pizza Rat.
2. There are no reporters except a simple console dump (it can be turned off). The library also dumps a JSON log
to disk. It would be easy to write reporters to read and format the JSON log.

#### Task Runners

In the spirit of smallness, I should mention that I don't use Grunt or Gulp. If you need to run tasks in Bash,
DOS, and other 'nix shells, you may need Gulp or Grunt. I use the shell, and shell scripts are a great way to
took your projects. You really don't need a scaffold to get a Node project up and ready for code. Rather than
relying on Gulp, Grunt, Gasp, or any task runner, Pizza Rat has a simple command line interface ready for shell
scripting.

#### Installing
```
npm install pizza-rat --save-dev
```

#### Structure of a Test Module

```javascript

'use strict';

const EXPECTEDVAL = 2112,
    SUITE = 'test1',
    DESCRIPT = 'demo test suite';

module.exports = {
    beforeTest: t => {
        //Anything passed as 3rd arg will be wrapped in a promise.
        //If it is a promise, it will be left as is per
        //Promise.resolve(...);
        return t.createContext(SUITE, DESCRIPT, EXPECTEDVAL);
    },

    tests: {
        'description 1': context => {
            context.equal(context.userData, EXPECTEDVAL);
        },
        'description 2': context => {
            context.ok(true, 'always passes');
            context.equal(loadCount, 1, 'load count must be 1');
        }
    }
};

```

#### Running

If your tests are in the folder `specs`:

```
ls -1 spec/*.js | node $(npm bin)/pizza-rat --consoleOutput=true
```
