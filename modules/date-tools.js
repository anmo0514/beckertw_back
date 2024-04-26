const moment = require("moment-timezone");

const dateFormat = "YYYY-MM-DD";
const datetimeFormat = "YYYY-MM-DD HH:mm:ss";

const toDateString = (t) => moment(t).format(dateFormat);
const toDatetimeString = (t) => moment(t).format(datetimeFormat);
const toDatetimeStringAdd15Mins = (t) => moment(t).add(15, 'm').format(datetimeFormat);


module.exports = {
    toDateString,
    toDatetimeString,
    toDatetimeStringAdd15Mins,
};
