var utils = require('../utils');
var desc = 'comb'; // upasarga

var tests = [
    ["अतिसं-", "अतिसंतुष्टः-तुष्ट"],
]

describe(desc, function() {
    utils.upasarga(desc, tests);
});
