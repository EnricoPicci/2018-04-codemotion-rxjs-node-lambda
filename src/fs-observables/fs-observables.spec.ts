
import 'mocha';
import * as rimraf from 'rimraf';

import {readLinesObs, writeFileObs, filesObs, makeDirObs, deleteDirObs} from './fs-observables';

describe('readLinesObs function', () => {
    
    it('reads all the lines of a file', done => {
        const filePath = 'src/fs-observables/fs-observable-test-dir/dir-2/file-2-1.txt';
        readLinesObs(filePath).subscribe(
            lines => {
                console.log('lines', lines);
                if (lines.length !== 5) {
                    console.error(filePath, lines);
                    return done(new Error('lines count failed'));
                }
                return done();
            },
            err => {
                console.error('ERROR', err);
            },
            () => console.log('COMPLETED')
        );

    });

});

describe('writeFileObs function', () => {
    
    it('writes a file with a certain content', done => {
        const filePathDir = 'src/fs-observables/fs-observable-test-dir-output/';
        const fileName = 'file-w.txt';
        const content = [
            'first line',
            'second line'
        ];
        // delete the target directory if it exists
        rimraf(filePathDir, err => {
            if (err) {
                console.error('code', err.name);
                console.error('err', err);
                return done(err);
            }
            const fullFileName = filePathDir + fileName;
            // writes the file and then checks, via filesObs function, that a file with the expected name exists
            writeFileObs(fullFileName, content)
                .switchMap(_filePath => filesObs(filePathDir))
                .subscribe(filePath => {
                    if (filePath !== fullFileName) {
                        console.error('filePath', filePath);
                        console.error('fullFileName', fullFileName);
                        return done(new Error('write file failed'));
                    }
                    rimraf(filePathDir, err => {
                        if (err) {
                            console.error('err', err);
                            return done(err);
                        }
                    });
                    return done();
                })
        });

    });

});

describe('makeDirObs function', () => {
    
    it('tries to create a directory - at the end it deletes the directory', done => {
        const dirName = 'new dir';
        makeDirObs(dirName).subscribe(
            data => {
                const expectedData = process.cwd() + '/' + dirName;
                if (data !== expectedData) {
                    console.error('expectedData', expectedData);
                    console.error('data', data);
                    return done(new Error('data not as expected '));
                }
            },
            err => console.error(err), 
            () => {
                deleteDirObs(dirName).subscribe();
                done();
            }
        );
    });

    it('tries to create a directory first and then the same directory - at the end it deletes the directory', done => {
        const dirName = 'another new dir';
        makeDirObs(dirName)
        .switchMap(data => {
            const expectedData = process.cwd() + '/' + dirName;
            if (data !== expectedData) {
                console.error('expectedData', expectedData);
                console.error('data', data);
                throw Error('data not as expected ');
            }
            return makeDirObs(dirName);
        })
        .subscribe(
            data => {
                if (data) {
                    console.error('expectedData', null);
                    console.error('data', data);
                    throw Error('data not as expected ');
                }
            },
            err => {
                deleteDirObs(dirName).subscribe();
                done(err);
            }, 
            () => {
                deleteDirObs(dirName).subscribe();
                done();
            }
        );
    });

});
