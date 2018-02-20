import 'mocha';

import {config} from '../config';
import {deleteDirObs, fileListObs} from '../fs-observables/fs-observables';
import {readTransformWriteCanti} from './read-transform-write-canti';

describe('readTransformWriteCanti function', () => {
    
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles: number;
        deleteDirObs(config.divinaCommediaCantiTransformedDir)
        .switchMap(_dirDeleted => fileListObs(config.divinaCommediaCantiDir))
        .map(files => numberOfSourceFiles = files.length)
        .switchMap(_data => readTransformWriteCanti())
        .subscribe(
            undefined,
            err => done(err),
            () => {
                let numberOfTransformedFiles: number;
                fileListObs(config.divinaCommediaCantiTransformedDir)
                .subscribe (
                    files => numberOfTransformedFiles = files.length,
                    err => done(err),
                    () => {
                        if (numberOfTransformedFiles !== numberOfSourceFiles) {
                            console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to number of source files '+ numberOfSourceFiles);
                            done(new Error('readTransformWriteCanti failed'));
                        } else {
                            done();
                        }
                    }
                )
            }
        )
    });

});
