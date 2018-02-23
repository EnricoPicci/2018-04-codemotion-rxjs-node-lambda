"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/map");
require("rxjs/add/operator/bufferCount");
require("rxjs/add/operator/concatMap");
const fs_observables_1 = require("../fs-observables/fs-observables");
const fs_observables_2 = require("../fs-observables/fs-observables");
const fs_observables_3 = require("../fs-observables/fs-observables");
const fs_observables_4 = require("../fs-observables/fs-observables");
const transform_canto_1 = require("./transform-canto");
const config_1 = require("../config");
function readTransformWriteCantiBlocks(blockSize, inputDir) {
    const sourceDir = inputDir ? inputDir : config_1.config.divinaCommediaCantiDir;
    const logFile = config_1.config.divinaCommediaCantiTransformedDirBlocks + 'log.txt';
    return fs_observables_1.fileListObs(sourceDir)
        .switchMap(cantiFileNames => Observable_1.Observable.from(cantiFileNames))
        .bufferCount(blockSize)
        .concatMap(fileNamesBlock => readTransformWriteCantiFromFiles(fileNamesBlock))
        .mergeMap(fileWritten => fs_observables_4.appendFileObs(logFile, fileWritten + '\n'));
}
exports.readTransformWriteCantiBlocks = readTransformWriteCantiBlocks;
function readTransformWriteCantiFromFiles(cantiFileNames) {
    return Observable_1.Observable.from(cantiFileNames)
        .mergeMap(cantoFileName => fs_observables_2.readLinesObs(cantoFileName)
        .map(cantoLines => {
        return { name: cantoFileName, content: cantoLines };
    }))
        .map(canto => transform_canto_1.transformCanto(canto, config_1.config.divinaCommediaCantiTransformedDirBlocks))
        .mergeMap(cantoTranformed => fs_observables_3.writeFileObs(cantoTranformed.name, cantoTranformed.content));
}
//# sourceMappingURL=read-transform-write-canti-blocks.js.map