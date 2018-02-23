
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/range';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';

import {fileListObs} from '../fs-observables/fs-observables';
import {readLinesObs} from '../fs-observables/fs-observables';
import {writeFileObs} from '../fs-observables/fs-observables';
import {config} from '../config';

// creates many copies of the 100 Canti into one directory - this is to create many files
export function duplicateCanti(numberOfDuplications: number) {
    return fileListObs(config.divinaCommediaCantiDir)
    .switchMap(cantiFileNames => Observable.from(cantiFileNames))
    .mergeMap(cantoFileName => readLinesObs(cantoFileName)
                                .map(cantoLines => {
                                    return {name: cantoFileName, content: cantoLines};
                                })
    )
    .bufferCount(100)
    .mergeMap(canti => Observable.range(1, numberOfDuplications)
                                    .map(iteration => {return {iteration, canti}})
    )
    .map(iterationCanti => iterationCanti.canti.map(canto => iteratedCanto(canto, iterationCanti.iteration)))
    .mergeMap(canti => Observable.from(canti))
    .mergeMap(canto => writeFileObs(canto.name, canto.content))
}

function iteratedCanto(canto, iteration: number) {
    const ret: {name: string, content: Array<string>} = {
        name: config.divinaCommediaCantiDirMany + iteration + ' ' + canto.name,
        content: canto.content
    };
    return ret;
}
