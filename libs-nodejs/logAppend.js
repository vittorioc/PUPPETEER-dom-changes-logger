const fs = require('fs');
const { dataOra } = require('./dataOra');

const logAppend = (() => {
    let fileName = dataOra().replace(/T/, '_').replace(/:/g, '-') + '.html';
    return async(log) => {
        fs.appendFile(
            fileName,
            '\n' + log,
            (err) => {
                if (err) {
                    console.log("fileLog error:", err);
                    throw err;
                } else {
                    console.log(log);
                }
            }
        );
    };
})();

module.exports = { logAppend }
