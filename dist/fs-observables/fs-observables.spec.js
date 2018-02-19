"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const rimraf = require("rimraf");
const fs_observables_1 = require("./fs-observables");
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
            if (err && err.name !== 'ENOENT') {
                console.error('code', err.name);
                console.error('err', err);
                return done(err);
            }
            const fullFileName = filePathDir + fileName;
            // writes the file and then checks, via filesObs function, that a file with the expected name exists
            fs_observables_1.writeFileObs(fullFileName, content)
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
//# sourceMappingURL=fs-observables.spec.js.map