
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/concatMap';

import {fileListObs} from '../fs-observables/fs-observables';
import {readLinesObs} from '../fs-observables/fs-observables';
import {writeFileObs} from '../fs-observables/fs-observables';

import {transformCanto} from './transform-canto';
import {config} from '../config';

export function readTransformWriteCantiBlocks(blockSize: number, inputDir?: string) {
    const sourceDir = inputDir ? inputDir : config.divinaCommediaCantiDir;
    return fileListObs(sourceDir)
            .switchMap(cantiFileNames => Observable.from(cantiFileNames))
            .bufferCount(blockSize)
            .concatMap(fileNamesBlock => readTransformWriteCantiFromFiles(fileNamesBlock))
}

function readTransformWriteCantiFromFiles(cantiFileNames: Array<string>) {
    return Observable.from(cantiFileNames)
            .mergeMap(cantoFileName => readLinesObs(cantoFileName)
                                        .map(cantoLines => {
                                            return {name: cantoFileName, content: cantoLines};
                                        })
            )
            .map(canto => transformCanto(canto, config.divinaCommediaCantiTransformedDirBlocks))
            .mergeMap(cantoTranformed => writeFileObs(cantoTranformed.name, cantoTranformed.content));
}
