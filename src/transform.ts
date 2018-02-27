import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/concatMap';

import * as _ from 'lodash';

import {fileListObs} from './aws-s3-observable';
import {readLinesObs} from './aws-s3-observable';
import {writeFileObs} from './aws-s3-observable';

import {config} from './config';

const readBucket = config.divinaCommediaCantiSourceBucket;
const writeBucket = config.divinaCommediaCantiTransformedWriteBucket;;

export function readTransformWriteCantiBlocks(blockSize: number) {
    console.log('readTransformWriteCantiBlocks start');
    return fileListObs(readBucket)
            .switchMap(cantiFileNames => Observable.from(cantiFileNames))
            .bufferCount(blockSize)
            .concatMap(fileNamesBlock => readTransformWriteCantiFromFiles(fileNamesBlock));
}

export function readTransformWriteCantiFromFiles(cantiFileNames: Array<string>) {
    return Observable.from(cantiFileNames)
            .mergeMap(cantoFileName => readLinesObs(readBucket, cantoFileName)
                                        .map(cantoLines => {
                                            return {name: cantoFileName, content: cantoLines};
                                        })
            )
            .map(canto => transformCantoLines(canto.name, canto.content))
            .mergeMap(transformedCanto => writeFileObs(writeBucket, transformedCanto.name, transformedCanto.content));
}

function transformCantoLines(name: string, content: Array<string>) {
    return {name, content: content.map((line, sequence) => transformLine(line, sequence))}
}
function transformLine(line: string, sequence: number) {
    const sequenceString = sequence + '';
    const sequenceStringPadded = _.padStart(sequenceString, 3) + '   ';
    return sequenceStringPadded + line;
}


export function readTransformWriteCanti() {
    console.log('readTransformWriteCanti start');
    return fileListObs(readBucket)
            .switchMap(cantiFileNames => Observable.from(cantiFileNames))
            .mergeMap(cantoFileName => readLinesObs(readBucket, cantoFileName)
                                        .map(cantoLines => {
                                            return {name: cantoFileName, content: cantoLines};
                                        })
            )
            .map(canto => transformCantoLines(canto.name, canto.content))
            .mergeMap(transformedCanto => writeFileObs(writeBucket, transformedCanto.name, transformedCanto.content));
}
