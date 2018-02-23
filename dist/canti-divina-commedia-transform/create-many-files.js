"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/observable/range");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/map");
require("rxjs/add/operator/bufferCount");
const fs_observables_1 = require("../fs-observables/fs-observables");
const fs_observables_2 = require("../fs-observables/fs-observables");
const fs_observables_3 = require("../fs-observables/fs-observables");
const config_1 = require("../config");
// creates many copies of the 100 Canti into one directory - this is to create many files
function duplicateCanti(numberOfDuplications) {
    return fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiDir)
        .switchMap(cantiFileNames => Observable_1.Observable.from(cantiFileNames))
        .mergeMap(cantoFileName => fs_observables_2.readLinesObs(cantoFileName)
        .map(cantoLines => {
        return { name: cantoFileName, content: cantoLines };
    }))
        .bufferCount(100)
        .mergeMap(canti => Observable_1.Observable.range(1, numberOfDuplications)
        .map(iteration => { return { iteration, canti }; }))
        .map(iterationCanti => iterationCanti.canti.map(canto => iteratedCanto(canto, iterationCanti.iteration)))
        .mergeMap(canti => Observable_1.Observable.from(canti))
        .mergeMap(canto => fs_observables_3.writeFileObs(canto.name, canto.content));
}
exports.duplicateCanti = duplicateCanti;
function iteratedCanto(canto, iteration) {
    const ret = {
        name: config_1.config.divinaCommediaCantiDirMany + iteration + ' ' + canto.name,
        content: canto.content
    };
    return ret;
}
//# sourceMappingURL=create-many-files.js.map