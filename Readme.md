# simple practical morph analyzer and samAsa parser for Sanskrit

beta, under heavy development - http://sa.diglossa.org

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
$ cd ~/bin
$ ln -s ~/path/to/morpheus/morph morph
everywhere:
$ morph get परेष
or
$ morph run pareza (takes slp1 for convenience)
// morph get simply gets dict from Couch DB
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
