
import 'mocha';
import * as _ from 'lodash';

import {filesPromise} from './fs-promise';
import {readLinesPromise} from './fs-promise';
import {makeDirPromise} from './fs-promise';
import {deleteDirPromise} from './fs-promise';
import {writeFilePromise} from './fs-promise';
import {appendFilePromise} from './fs-promise';
import {deleteFilePromise} from './fs-promise';

const dirPath = 'transform/src/fs-async-await/fs-async-await-test-dir/';
const filePath = 'transform/src/fs-async-await/fs-async-await-test-dir/dir-2/file-2-1.txt';

describe('filesPromise function used with async await', () => {

    async function filesAsyncAwaitTest(fromDirPath: string) {
        return await filesPromise(fromDirPath);
    }
    
    it('reads the files of a directory', done => {
        filesAsyncAwaitTest(dirPath)
        .then(files => {
                console.log('files', files);
                if (files.length !== 3) {
                    console.error(dirPath, files);
                    return done(new Error('files count failed'));
                }
                return done();
            }
        );

    });

});


describe('readLinesPromise function used with async await', () => {
    async function readLinesAsyncAwaitTest(filePath: string) {
        return await readLinesPromise(filePath);
    }
    
    it('reads all the lines of a file', done => {
        readLinesAsyncAwaitTest(filePath)
        .then(
            data => {
                console.log('lines', data.lines);
                if (data.lines.length !== 5) {
                    console.error(data.filePath, data.lines);
                    return done(new Error('lines count failed'));
                }
                return done();
            }
        );
    });

});


describe('filesPromise and readLinesPromise functions used with async await', () => {
    async function readLinesFromFirstFileAsyncAwaitTest(fromDirPath: string) {
        const files = await filesPromise(fromDirPath);
        return await readLinesPromise(files[0]);
    }
    
    it('reads all the lines of a file', done => {
        readLinesFromFirstFileAsyncAwaitTest(dirPath)
        .then(
            data => {
                console.log('lines', data.lines);
                if (data.lines.length !== 5) {
                    console.error(data.filePath, data.lines);
                    return done(new Error('lines count failed'));
                }
                return done();
            }
        );
    });

});

describe('makeDirPromise and deleteDirPromise functions used with async await', () => {
    async function makeDirAsyncAwaitTest(dirPath: string) {
        return await makeDirPromise(dirPath);
    }
    async function deleteDirAsyncAwaitTest(dirPath: string) {
        return await deleteDirPromise(dirPath);
    }
    
    it('creates a directory and then deletes it', done => {
        const newDirPath = 'new-dir';
        makeDirAsyncAwaitTest(newDirPath)
        .then(
            data => {
                console.log('new dirPath', data);
                if (data !== newDirPath) {
                    console.error('error in creating a directory', data);
                    return done(new Error('error in creating a directory'));
                }
                deleteDirAsyncAwaitTest(data)
                .then(data => {
                    console.log('delted dirPath', data);
                    if (data !== newDirPath) {
                        console.error('error in deleting a directory', data);
                        return done(new Error('error in deleting a directory'));
                    }
                    return done();
                })
            }
        );
    });

});


describe('writeFileasync function', () => {
        async function writeFilePromiseTest(filePathDir: string, fileName: string, content: Array<string>) {
            await deleteDirPromise(filePathDir);
            return await writeFilePromise(filePathDir + fileName, content);
        }
    
    it('writes a file with a certain content', done => {
        const filePathDir = 'transform/src/fs-async-await/fs-async-await-test-dir-output/';
        const fileName = 'file-w.txt';
        const content = [
            'first line',
            'second line'
        ];
        writeFilePromiseTest(filePathDir, fileName, content)
        .then(data => {
            if (data != filePathDir + fileName) {
                console.error('name of the file written not correct', data);
                return done('name of the file written not correct');
            }
            // checks, via readLinesPromise function, that a file with the expected name exists
            const fullFileName = filePathDir + fileName;
            readLinesPromise(fullFileName)
            .then(data => {
                if (fullFileName !== data.filePath) {
                    console.error('fullFileName not correct', data);
                    return done(new Error('fullFileName not correct'));
                }
                if (data.lines.length != 2 || data.lines[1] !== content[1]) {
                    console.error('content of the file written not correct', data);
                    return done(new Error('content of the file written not correct'));
                }
                deleteDirPromise(filePathDir);
                done();
            })
        });

    });

});

describe('appendFilePromise function', () => {

    async function appendFilePromiseAsyncAwaitTest(logFile: string, linePlusReturn: string) {
        const lineAppended = await appendFilePromise(logFile, linePlusReturn);
        // removes the last char which is carriage return - this should be the line appended
        const lineEmitted = lineAppended.substr(0, lineAppended.length - 1);
        return appendFilePromise(logFile, lineEmitted)
    }
    
    it('appends 2 lines to a file', done => {
        const logFile = 'log.txt';
        const line = 'I am a line promise';
        const linePlusReturn = line + '\n';
        appendFilePromiseAsyncAwaitTest(logFile, linePlusReturn)
        .then(
            _data => {
                readLinesPromise(logFile)
                .then(data => {
                    const linesExpected =[line, line];
                    const areLinesCorrect = _.isEqual(data.lines, linesExpected);
                    if (!areLinesCorrect) {
                        console.error('lines logged:', data.lines);
                        console.error('lines expected:', linesExpected);
                        deleteFilePromise(logFile);
                        return done(new Error('appends 2 lines to a file failed'));
                    }
                    deleteFilePromise(logFile);
                    done();
                })
            }
        );

    });

});