"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/observable/from");
const fs_observables_1 = require("../fs-observables/fs-observables");
function extractCanti(divinaCommediaText) {
    return fs_observables_1.readLinesObs(divinaCommediaText)
        .map(lines => lines.filter(line => line.trim().length > 0))
        .map(lines => lines.filter(line => ['INFERNO', 'PURGATORIO', 'PARADISO'].indexOf(line.trim()) === -1))
        .map(lines => splitCanti(lines))
        .map(linesOfCanti => linesOfCanti
        .map((linesOfCanto, sequence) => {
        return { name: linesOfCanto[0], content: linesOfCanto, sequence: sequence + 1 };
    }));
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
function writeAllCanti(divinaCommediaTextFileName, outputDir) {
    const lastCharOfDirName = outputDir[outputDir.length - 1];
    const dirNameWithSlash = lastCharOfDirName === '/' ? outputDir : outputDir + '/';
    return extractCanti(divinaCommediaTextFileName)
        .map(allCanti => cantiche(allCanti))
        .switchMap(cantiche => Observable_1.Observable.from(cantiche))
        .mergeMap(canti => writeCantica(canti, dirNameWithSlash));
}
exports.writeAllCanti = writeAllCanti;
function writeCantica(cantica, outputDir) {
    return Observable_1.Observable.from(cantica.canti)
        .mergeMap(canto => {
        let sequenceString = canto.sequence + '';
        sequenceString = sequenceString.length === 1 ? '0' + sequenceString : sequenceString;
        const cantoTitle = sequenceString + ' - ' + cantica.name + ' - ' + canto.name;
        return writeCanto(cantoTitle, canto.content, outputDir);
    });
}
function writeCanto(title, content, outputDir) {
    const fileName = outputDir + title + '.txt';
    return fs_observables_1.writeFileObs(fileName, content);
}
function cantiche(allCanti) {
    const cantiche = Array();
    cantiche.push(inferno(allCanti));
    cantiche.push(purgatorio(allCanti));
    cantiche.push(paradiso(allCanti));
    return cantiche;
}
exports.cantiche = cantiche;
function inferno(allCanti) {
    return { name: 'Inferno', canti: allCanti.slice(0, 34) };
}
function purgatorio(allCanti) {
    return { name: 'Purgatorio', canti: allCanti.slice(34, 67) };
}
function paradiso(allCanti) {
    return { name: 'Paradiso', canti: allCanti.slice(67, 100) };
}
//# sourceMappingURL=extract-canti.js.map