import 'mocha';

import {config} from '../config';
import {fileListObs} from '../fs-observables/fs-observables';
import {deleteDirObs} from '../fs-observables/fs-observables';
import {readTransformWriteCantiBlocks} from './read-transform-write-canti-blocks';

describe('readTransformWriteCantiBlocks function', () => {
    
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles: number;
        deleteDirObs(config.divinaCommediaCantiTransformedDirBlocks)
        .switchMap(_dirDeleted => fileListObs(config.divinaCommediaCantiDir))
        .map(files => numberOfSourceFiles = files.length)
        .switchMap(_data => readTransformWriteCantiBlocks(20))
        .subscribe(
            undefined,
            err => done(err),
            () => {
                let numberOfTransformedFiles: number;
                fileListObs(config.divinaCommediaCantiTransformedDirBlocks)
                .subscribe (
                    files => numberOfTransformedFiles = files.length,
                    err => done(err),
                    () => {
                        // adds the log file to the number of expected files
                        const expectedWrittenFiles = numberOfSourceFiles + 1;
                        if (numberOfTransformedFiles !== expectedWrittenFiles) {
                            console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to number of source files '+ numberOfSourceFiles);
                            done(new Error('readTransformWriteCantiBlocks failed'));
                        } else {
                            done();
                        }
                    }
                )
            }
        )
    });

});
