"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/map");
const fs_observables_1 = require("../fs-observables/fs-observables");
const fs_observables_2 = require("../fs-observables/fs-observables");
const fs_observables_3 = require("../fs-observables/fs-observables");
const fs_observables_4 = require("../fs-observables/fs-observables");
const transform_canto_1 = require("./transform-canto");
const config_1 = require("../config");
function readTransformWriteCanti(inputDir) {
    const sourceDir = inputDir ? inputDir : config_1.config.divinaCommediaCantiDir;
    const logFile = config_1.config.divinaCommediaCantiTransformedDir + 'log.txt';
    return fs_observables_1.fileListObs(sourceDir)
        .switchMap(cantiFileNames => Observable_1.Observable.from(cantiFileNames))
        .mergeMap(cantoFileName => fs_observables_2.readLinesObs(cantoFileName)
        .map(cantoLines => {
        return { name: cantoFileName, content: cantoLines };
    }))
        .map(canto => transform_canto_1.transformCanto(canto, config_1.config.divinaCommediaCantiTransformedDir))
        .mergeMap(cantoTranformed => fs_observables_3.writeFileObs(cantoTranformed.name, cantoTranformed.content))
        .mergeMap(fileWritten => fs_observables_4.appendFileObs(logFile, fileWritten + '\n'));
}
exports.readTransformWriteCanti = readTransformWriteCanti;
//# sourceMappingURL=read-transform-write-canti.js.map