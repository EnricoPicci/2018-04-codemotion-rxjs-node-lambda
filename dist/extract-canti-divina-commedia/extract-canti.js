"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_observables_1 = require("../fs-observables/fs-observables");
function extractCanti(divinaCommediaText) {
    return fs_observables_1.readLinesObs(divinaCommediaText)
        .map(lines => splitCanti(lines));
}
exports.extractCanti = extractCanti;
function splitCanti(lines) {
    const canti = new Array();
    let canto;
    let numberedLine;
    let lineNumber;
    for (const line of lines) {
        if (isFirstLineOfCanto(line)) {
            if (canto) {
                canti.push(canto);
            }
            canto = new Array();
            lineNumber = 1;
            numberedLine = { lineNumber, line };
            canto.push(numberedLine);
        }
    }
    return canti;
}
function isFirstLineOfCanto(line) {
    return line.split(' ')[0] === 'CANTO';
}
exports.isFirstLineOfCanto = isFirstLineOfCanto;
//# sourceMappingURL=extract-canti.js.map