
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/switchMap';

import * as fs from 'fs';
import * as readline from 'readline';
import * as mkdirp from 'mkdirp';
import * as dir from 'node-dir';
import * as rimraf from 'rimraf';


// =============================  Read a file line by line and emits when completed =========================================
// returns and Observable which emits an array containing the lines of the file as strings
export const readLinesObs = Observable.bindCallback(_readLines);
function _readLines(filePath: string, callback: (lines: Array<string>) => void) {
    const lines = new Array<string>();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line: string)  => {
        lines.push(line);
    });
    rl.on('close', ()  => {
        callback(lines);
    })
}

// ======================  Writes an array of strings as lines in a file and emits when completed =========================
// Writes a file whose content is represented by an array of strings.
// Each string is a line of the file.
// If the directory is not present, is created
// Returns an Observable which emits the name of the file written when the write operation is completed
export function writeFileObs(filePath: string, lines: Array<string>) {
    return _writeFileObs(filePath, lines);
}
const _writeFileObs = Observable.bindCallback(_writeFile);
function _writeFile(
    filePath: string,
    lines: Array<string>,
    callback: (filePath: string) => void
) {
    const lastSlash = filePath.lastIndexOf('/');
    const fileDir = filePath.substr(0, lastSlash + 1);
    mkdirp(fileDir, err => {
        if (err) {
            console.error('error in creating a directory', err);
            throw err;
        }
        const fileContent = lines.join('\n');
        fs.writeFile(filePath, fileContent, err => {
            if (err) throw err;
            callback(filePath);
        })
    });
}

// ============  Emits the list of names of the files present in a directory and subdirectories =========
// returns and Observable which emits once with the list of files found in the directory and all its subdirectories
export function fileListObs(fromDirPath: string) {
    return _fileListObs(fromDirPath);
}
const _fileListObs = Observable.bindNodeCallback(dir.files);


// ============  Emits each name of the files present in a directory and subdirectories =========
// returns and Observable which emits for each file found in the directory and all its subdirectories
export function filesObs(fromDirPath: string) {
    return fileListObs(fromDirPath)
            .switchMap(files => Observable.from(files));
}

// ============  Deletes a directory and subdirectories and emits when completed =========
// returns and Observable which emits null when the directory and all its subdirectories have been deleted or an error otherwise
export function deleteDirObs(dirPath: string) {
    return _rimraf(dirPath);
}
const _rimraf = Observable.bindCallback(rimraf);

// ============  Creates a directory and emits when completed =========
// returns and Observable which emits the name of the directory when the directory has been created or an error otherwise
export function makeDirObs(dirPath: string) {
    return _mkdirp(dirPath);
}
const _mkdirp = Observable.bindNodeCallback(mkdirp);


// ============  Appends a line to a file and emits when completed =========
// returns and Observable which emits the line appended when the line has been appended or an error otherwise
export function appendFileObs(filePath: string, line: string) {
    return _appendFile(filePath, line);
}
function appendFileNode(filePath: string, line: string, cb: (err, data: string) => void) {
    return fs.appendFile(filePath, line, err => {
        cb(err, line);
    });
}
const _appendFile = Observable.bindNodeCallback(appendFileNode);

// ============  Deletes a file and emits when completed =========
// returns and Observable which emits the name of the file when the line has been deleted or an error otherwise
export function deleteFileObs(filePath: string) {
    return _deleteFile(filePath);
}
function deleteFileNode(filePath: string, cb: (err, data: string) => void) {
    return fs.unlink(filePath, err => {
        cb(err, filePath);
    });
}
const _deleteFile = Observable.bindNodeCallback(deleteFileNode);
