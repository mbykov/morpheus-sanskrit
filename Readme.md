# simple practical samAsa parser and morph analyzer for Sanskrit

beta, under heavy development - http://sa.diglossa.org

v. 0.4.0, 'विश्रम', i.e. - relax

## Installation

With node.js:

````bash
$ git clone github.com/mbykov/morpheus
$ cd morpheus
$ npm install
````
## API

````javascript
var morph = require('morpheus');
morph.run(samasa, null, function(res) {
        console.log(res);
    });
````

## Bash

only for testing and developing:

````bash
$ cd ~/bin
$ ln -s ~/path/to/morpheus/morph morph
````
everywhere:

````bash
$ morph run अभिहता
````
morph takes slp1 for convenience:

````bash
$ morph run aBihatA
````
=>

````bash
morph-0.4 res: ==============>>
{ queries:
   [ { ind: true,
       type: 'Apte',
       query: 'अभि',
       slp: 'aBi',
       dicts: [ '34bc2835df6c6c1e41c2d71ac6f66d53' ] },
etc, etc, etc,
  pdchs: [ [ 'अभि', 'हता' ] ] }
morph: 177.619ms
````


also, $ morph get simply gets dict from CouchDB by



## License

  GNU GPL
