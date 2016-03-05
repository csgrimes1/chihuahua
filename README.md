# Chihuahua
*Lightweight unit test library*

![Chihuahua](./logo.png)

Most (if not all) unit test modules are frameworks rather than libraries. A Chihuahua is tiny, but it can 
navigate a dog park full of larger canines. Like the dog breed, Chihuahua the library is a small footprint
module that stacks up well against the frameworks. Chihuahua does one thing really well: it runs tests.
When complete, the results are stored as an intuitive block
of JSON in a configurable folder. This library does not contain anything but a default reporter, designed to
help you test quickly and identify the cause of test failures. It supports custom reporting as an
external operation - anyone can write a script to pick up and format the test log.

### Good Things Can Come From Small Packages

Small is good with NPM modules. In the day and age of microservices, we often create ironically large dependency
trees in the node_modules folder. Often, the size of the tree is a result of secondhand dependencies.
It's a developer's choice whether to host a large dependency tree. However, Chihuahua
should not _impose_ slow NPM installs on the developer. If you are Dockerizing
your Node application, you'll endure significant wait times from NPM install already. Therefore, it's good to
keep the node_modules at a minimum in Chihuahua.

This library is small, and here is why:

1. The CLI finds tests using STDIN rather than a glob expression. Nothing against globs, but glob libraries
bring many nested dependencies, adding weight to the package. It's quite easy to pipe the `ls` command
to Chihuahua.
2. There are no reporters except a simple console dump (it can be turned off). The library also dumps a JSON log
to disk. It would be easy to write reporters to read and format the JSON log.

### Task Runners

In the spirit of smallness, I should mention that I don't use Grunt or Gulp. If you need to run tasks across incompatible
shells like Bash and DOS, you may need Gulp or Grunt. When your project allows, shell scripts are a great way to
tool your source code. You really don't need a scaffold to get a Node project up and ready for code. Rather than
relying on Gulp, Grunt, Gasp, or any task runner, Chihuahua has a simple command line interface ready for shell
scripting.

### Installing
```
npm install chihuahua --save-dev
```

### Structure of a Test Module

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

You are required to export a `beforeTest` function taking one argument from each
test module. At the end of this setup function, you call and return the result
of `t.createContext`. The API is documented in detail below. 

Tests are defined in `module.exports.tests`. Each key of the object's properties
is a test description, and each value is a function taking one parameter.

Note that Chihuahua does not make you call any function to mark the end of
your tests. Every `beforeTest` and test function is built for promises. Simply
return a promise from a function to make Chihuahua wait it out.

### Running

If your tests are in the folder `specs`:

```
ls -1 spec/*.js | node $(npm bin)/runsuite --consoleOutput=true
```

### API

#### Your Module

`module.exports.beforeTest = function(t) { ... }`

 * `t` Instance of `TestInitialization`.
 * This function _must_ return `t.createContext(...)`.
 
`module.exports.tests` Object defining tests

 * Each property name is a test description.
 * Each property value is a function taking a single argument, an
 instance of `TestContext`.
 
#### TestInitialization

`TestInitialization.createContext(suite, description, userData, timeout)`

 * `suite` Name of test module.
 * `description` Verbose description of test module.
 * `userData` Test setup data, such as mocks.
 * `timeout` Optional timeout value, defaulting to 5000 ms.
 
#### TestContext

 * Property `userData`  Data created during setup phase in `beforeTest`.
 * Assertion functions. All of the assertions are wrappers on the
 NodeJS [assert module](https://nodejs.org/dist/latest-v4.x/docs/api/assert.html) functions.
