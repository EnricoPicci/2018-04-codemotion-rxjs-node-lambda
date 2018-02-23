"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/bindCallback");
require("rxjs/add/observable/bindNodeCallback");
require("rxjs/add/observable/from");
require("rxjs/add/operator/switchMap");
const fs = require("fs");
const readline = require("readline");
const mkdirp = require("mkdirp");
const dir = require("node-dir");
const rimraf = require("rimraf");
// =============================  Read a file line by line and emits when completed =========================================
// returns and Observable which emits an array containing the lines of the file as strings
exports.readLinesObs = Observable_1.Observable.bindCallback(_readLines);
function _readLines(filePath, callback) {
    const lines = new Array();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        lines.push(line);
    });
    rl.on('close', () => {
        callback(lines);
    });
}
// ======================  Writes an array of strings as lines in a file and emits when completed =========================
// Writes a file whose content is represented by an array of strings.
// Each string is a line of the file.
// If the directory is not present, is created
// Returns an Observable which emits the name of the file written when the write operation is completed
function writeFileObs(filePath, lines) {
    return _writeFileObs(filePath, lines);
}
exports.writeFileObs = writeFileObs;
const _writeFileObs = Observable_1.Observable.bindCallback(_writeFile);
function _writeFile(filePath, lines, callback) {
    const lastSlash = filePath.lastIndexOf('/');
    const fileDir = filePath.substr(0, lastSlash + 1);
    mkdirp(fileDir, err => {
        if (err) {
            console.error('error in creating a directory', err);
            throw err;
        }
        const fileContent = lines.join('\n');
        fs.writeFile(filePath, fileContent, err => {
            if (err)
                throw err;
            callback(filePath);
        });
    });
}
// ============  Emits the list of names of the files present in a directory and subdirectories =========
// returns and Observable which emits once with the list of files found in the directory and all its subdirectories
function fileListObs(fromDirPath) {
    return _fileListObs(fromDirPath);
}
exports.fileListObs = fileListObs;
const _fileListObs = Observable_1.Observable.bindNodeCallback(dir.files);
// ============  Emits each name of the files present in a directory and subdirectories =========
// returns and Observable which emits for each file found in the directory and all its subdirectories
function filesObs(fromDirPath) {
    return fileListObs(fromDirPath)
        .switchMap(files => Observable_1.Observable.from(files));
}
exports.filesObs = filesObs;
// ============  Deletes a directory and subdirectories and emits when completed =========
// returns and Observable which emits null when the directory and all its subdirectories have been deleted or an error otherwise
function deleteDirObs(dirPath) {
    return _rimraf(dirPath);
    // return _relaxedRimraf(dirPath);
}
exports.deleteDirObs = deleteDirObs;
const _rimraf = Observable_1.Observable.bindCallback(rimraf);
// ============  Creates a directory and emits when completed =========
// returns and Observable which emits the name of the directory when the directory has been created or an error otherwise
function makeDirObs(dirPath) {
    return _mkdirp(dirPath);
}
exports.makeDirObs = makeDirObs;
const _mkdirp = Observable_1.Observable.bindNodeCallback(mkdirp);
// ============  Appends a line to a file and emits when completed =========
// returns and Observable which emits the line appended when the line has been appended or an error otherwise
function appendFileObs(filePath, line) {
    return _appendFile(filePath, line);
}
exports.appendFileObs = appendFileObs;
function appendFileNode(filePath, line, cb) {
    return fs.appendFile(filePath, line, err => {
        cb(err, line);
    });
}
const _appendFile = Observable_1.Observable.bindNodeCallback(appendFileNode);
// ============  Deletes a file and emits when completed =========
// returns and Observable which emits the name of the file when the line has been deleted or an error otherwise
function deleteFileObs(filePath) {
    return _deleteFile(filePath);
}
exports.deleteFileObs = deleteFileObs;
function deleteFileNode(filePath, cb) {
    return fs.unlink(filePath, err => {
        cb(err, filePath);
    });
}
const _deleteFile = Observable_1.Observable.bindNodeCallback(deleteFileNode);
//# sourceMappingURL=fs-observables.js.map