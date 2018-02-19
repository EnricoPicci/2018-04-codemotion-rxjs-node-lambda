"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
const fs_observables_1 = require("../fs-observables/fs-observables");
function extractCanti(divinaCommediaText) {
    return fs_observables_1.readLinesObs(divinaCommediaText)
        .map(lines => lines.filter(line => line.trim().length > 0))
        .map(lines => lines.filter(line => ['INFERNO', 'PURGATORIO', 'PARADISO'].indexOf(line.trim()) === -1))
        .map(lines => splitCanti(lines));
}
exports.extractCanti = extractCanti;
function splitCanti(lines) {
    const canti = new Array();
    let canto;
    for (const line of lines) {
        if (isFirstLineOfCanto(line)) {
            if (canto) {
                canti.push(canto);
            }
            canto = new Array();
            canto.push(line);
        }
        else {
            if (canto) {
                canto.push(line);
            }
        }
    }
    canti.push(canto);
    return canti;
}
function isFirstLineOfCanto(line) {
    return line.indexOf('CANTO') > -1;
}
exports.isFirstLineOfCanto = isFirstLineOfCanto;
//# sourceMappingURL=extract-canti.js.map