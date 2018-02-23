"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const rimraf = require("rimraf");
const _ = require("lodash");
require("rxjs/add/operator/do");
const fs_observables_1 = require("./fs-observables");
const fs_observables_2 = require("./fs-observables");
const fs_observables_3 = require("./fs-observables");
describe('readLinesObs function', () => {
    it('reads all the lines of a file', done => {
        const filePath = 'src/fs-observables/fs-observable-test-dir/dir-2/file-2-1.txt';
        fs_observables_1.readLinesObs(filePath).subscribe(lines => {
            console.log('lines', lines);
            if (lines.length !== 5) {
                console.error(filePath, lines);
                return done(new Error('lines count failed'));
            }
            return done();
        }, err => {
            console.error('ERROR', err);
        }, () => console.log('COMPLETED'));
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
            // writes the file and then runs the checks 
            fs_observables_1.writeFileObs(fullFileName, content)
                .do(data => {
                if (fullFileName !== data) {
                    console.error('data emitted', data);
                    console.error('fullFileName', fullFileName);
                    return done(new Error('data emitted by write failed'));
                    // throw 'data emitted by write failed';
                }
            })
                .switchMap(_filePath => fs_observables_1.filesObs(filePathDir))
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
            });
        });
    });
});
describe('makeDirObs function', () => {
    it('tries to create a directory - at the end it deletes the directory', done => {
        const dirName = 'new dir';
        fs_observables_1.makeDirObs(dirName).subscribe(data => {
            const expectedData = process.cwd() + '/' + dirName;
            if (data !== expectedData) {
                console.error('expectedData', expectedData);
                console.error('data', data);
                return done(new Error('data not as expected '));
            }
        }, err => console.error(err), () => {
            fs_observables_1.deleteDirObs(dirName).subscribe();
            done();
        });
    });
    it('tries to create a directory first and then the same directory - at the end it deletes the directory', done => {
        const dirName = 'another new dir';
        fs_observables_1.makeDirObs(dirName)
            .switchMap(data => {
            const expectedData = process.cwd() + '/' + dirName;
            if (data !== expectedData) {
                console.error('expectedData', expectedData);
                console.error('data', data);
                throw Error('data not as expected ');
            }
            return fs_observables_1.makeDirObs(dirName);
        })
            .subscribe(data => {
            if (data) {
                console.error('expectedData', null);
                console.error('data', data);
                throw Error('data not as expected ');
            }
        }, err => {
            fs_observables_1.deleteDirObs(dirName).subscribe();
            done(err);
        }, () => {
            fs_observables_1.deleteDirObs(dirName).subscribe();
            done();
        });
    });
});
describe('appendFileObs function', () => {
    it('appends 2 lines to a file', done => {
        const logFile = 'log.txt';
        const line = 'I am a line';
        const linePlusReturn = line + '\n';
        fs_observables_2.appendFileObs(logFile, linePlusReturn)
            .switchMap(data => {
            // removes the last char which is carriage return - this should be the line appended
            const lineEmitted = data.substr(0, data.length - 1);
            return fs_observables_2.appendFileObs(logFile, lineEmitted);
        })
            .subscribe(undefined, err => {
            console.error('ERROR', err);
            done(err);
        }, () => {
            fs_observables_1.readLinesObs(logFile)
                .subscribe(lines => {
                const linesExpected = [line, line];
                const areLinesCorrect = _.isEqual(lines, linesExpected);
                if (!areLinesCorrect) {
                    console.error('lines logged:', lines);
                    console.error('lines expected:', linesExpected);
                    return done(new Error('appends 2 lines to a file failed'));
                }
                fs_observables_3.deleteFileObs(logFile).subscribe();
                done();
            });
        });
    });
});
//# sourceMappingURL=fs-observables.spec.js.map