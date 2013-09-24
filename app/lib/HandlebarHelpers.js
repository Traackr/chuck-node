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
