import 'mocha';

import {config} from '../config';
import {deleteDirObs, fileListObs} from '../fs-observables/fs-observables';
import {readTransformWriteCanti1} from './read-transform-write-canti-1';

describe('readTransformWriteCanti1 function', () => {
    
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles: number;
        deleteDirObs(config.divinaCommediaCantiTransformedDir1)
        .switchMap(_dirDeleted => fileListObs(config.divinaCommediaCantiDir))
        .map(files => numberOfSourceFiles = files.length)
        .switchMap(_data => readTransformWriteCanti1())
        .subscribe(
            undefined,
            err => done(err),
            () => {
                let numberOfTransformedFiles: number;
                fileListObs(config.divinaCommediaCantiTransformedDir1)
                .subscribe (
                    files => numberOfTransformedFiles = files.length,
                    err => done(err),
                    () => {
                        if (numberOfTransformedFiles !== numberOfSourceFiles) {
                            console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to number of source files '+ numberOfSourceFiles);
                            done(new Error('readTransformWriteCanti1 failed'));
                        } else {
                            done();
                        }
                    }
                )
            }
        )
    });

});
