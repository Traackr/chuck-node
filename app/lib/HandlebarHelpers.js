var moment = require('moment')

/**  
 * Format an ISO date using Moment.js
 * http://momentjs.com/
 *  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
 *  usage: {{dateFormat creation_date format="MMMM YYYY"}}
 * @example handlebar helper
 */
exports.dateFormat = function(context, block) {
    if (!context) return "";
    var f = block.hash.format || "MMM Do, YYYY";
    var ret =  moment(new Date(context)).format(f);
    console.log(ret)
    return ret;
}


exports.compare = function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    operator = options.hash.operator || "==";
    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }
    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    var result = operators[operator](lvalue,rvalue);
    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}