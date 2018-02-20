
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import {fileListObs} from '../fs-observables/fs-observables';
import {readLinesObs} from '../fs-observables/fs-observables';
import {writeFileObs} from '../fs-observables/fs-observables';

import {transformCanto} from './transform-canto';
import {config} from '../config';

export function readTransformWriteCanti() {
    return fileListObs(config.divinaCommediaCantiDir)
            .switchMap(cantiFileNames => Observable.from(cantiFileNames))
            .mergeMap(cantoFileName => readLinesObs(cantoFileName)
                                        .map(cantoLines => {
                                            return {name: cantoFileName, content: cantoLines};
                                        })
            )
            .map(canto => transformCanto(canto, config.divinaCommediaCantiTransformedDir))
            .mergeMap(cantoTranformed => writeFileObs(cantoTranformed.name, cantoTranformed.content));
}
