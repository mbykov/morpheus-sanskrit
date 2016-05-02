# simple practical morph analyzer and samAsa parser for Sanskrit

beta, under heavy development - http://sanskrit.diglossa.org

v. 0.3.0, 'शयन'

## Installation

With node.js:

````bash
$ git clone github.com/mbykov/morpheus-03
$ cd morpheus
$ npm install
````

## Bash

````bash
$ node run.js परेष
or
$ node run.js pareza (takes slp1 for convenience)
````

## API
````javascript
var morph = require('morpheus');
morph.run(samasa, null, function(res) {
        console.log(res);
    });
````



## License

  GNU GPL
