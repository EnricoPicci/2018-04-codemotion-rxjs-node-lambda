import 'mocha';

import {config} from '../config';
import {deleteDirPromise, filesPromise} from '../fs-async-await/fs-promise';
import {readTransformWriteCanti} from './read-transform-write-canti';

describe('readTransformWriteCanti function', () => {

    let expectedWrittenFiles: number;
    const targetDir = config.divinaCommediaCantiTransformedDirAsyncAwait;

    async function readTransformWriteCantiAsyncAwaitTest() {
        await deleteDirPromise(targetDir);
        const sourceFiles = await filesPromise(config.divinaCommediaCantiDir);
        // adds the log file to the number of expected files
        expectedWrittenFiles = sourceFiles.length  + 1;
        return readTransformWriteCanti();
    }
    
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        readTransformWriteCantiAsyncAwaitTest()
        .then(_data => {
            filesPromise(targetDir)
            .then(files => {
                if (files.length !== expectedWrittenFiles) {
                    console.error('number of transformed files ' + files.length + ' not equal to the expected number files '+ expectedWrittenFiles);
                    return done(new Error('readTransformWriteCanti failed'));
                }
                done();
            })
        })
    });

});
