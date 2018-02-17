"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/bindCallback");
const fs = require("fs");
const readline = require("readline");
// =============================  Read a file line by line =========================================
// returns and Observable which emits an array containing the lines of the file as strings
exports.readLinesObs = Observable_1.Observable.bindCallback(_readLines);
function _readLines(filePath, callback) {
    const lines = new Array();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        lines.push(line);
    });
    rl.on('close', () => {
        callback(lines);
    });
}
//# sourceMappingURL=fs-observables.js.map