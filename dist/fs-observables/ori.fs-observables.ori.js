"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/from");
require("rxjs/add/observable/bindCallback");
require("rxjs/add/observable/bindNodeCallback");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/filter");
const fs = require("fs");
const readline = require("readline");
const dir = require("node-dir");
const mkdirp = require("mkdirp");
// ============  Retrieves the names of the files present in a directory and subdirectories =========
// returns and Observable which emits for each file found in the directory and all its subdirectories
function filesObs(fromDirPath) {
    return fileListObs(fromDirPath)
        .switchMap(files => Observable_1.Observable.from(files));
}
exports.filesObs = filesObs;
// returns and Observable which emits once with the list of files found in the directory and all its subdirectories
function fileListObs(fromDirPath) {
    return _fileListObs(fromDirPath);
}
exports.fileListObs = fileListObs;
const _fileListObs = Observable_1.Observable.bindNodeCallback(dir.files);
// ============  Reads a file  =========
// returns and Observable which emits when the content of the file is read
exports.readFileObs = Observable_1.Observable.bindNodeCallback(fs.readFile);
// =============================  Read a file line by line =========================================
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
// =============================  Select snippets contained in a file =========================================
// Returns an Observable which emits any time a file containing a snippet is found
// The returned observable is of type Observable<[]>
// the Array emitted by the Observable contains 2 items:
//  first item: is the name of the file which contains the snippets
//  second item: an array of arrays of NumberedLine
//                each array represents a snippet
//                each NumberedLine in the array represents a line of the file
function findSnippetsObs(fromDirPath, startSnippet, endSnippet, skipLine) {
    return fileListObs(fromDirPath)
        .switchMap(fileList => readFileSnippetsObs(fileList, startSnippet, endSnippet, skipLine))
        .filter(fileAndSnippet => fileAndSnippet.snippets.length > 0);
}
exports.findSnippetsObs = findSnippetsObs;
function readFileSnippetsObs(fileList, startSnippet, endSnippet, skipLine) {
    return Observable_1.Observable.from(fileList)
        .mergeMap(filePath => _findSnippetsObs(filePath, startSnippet, endSnippet, skipLine));
}
exports.readFileSnippetsObs = readFileSnippetsObs;
// the selector used as the second parameter in the bindCallback method is required to have 
// the right inference from intellisense
// https://stackoverflow.com/questions/47402073/inference-with-typescript-observable-and-bindcallback-method/47403711#47403711
const _findSnippetsObs = Observable_1.Observable.bindCallback(_findSnippets, (filePath, snippets) => ({ filePath, snippets }));
function _findSnippets(filePath, startSnippetToken, endSnippetToken, skipLine, callback) {
    if (!skipLine) {
        skipLine = (_line) => false;
    }
    let startSnippetFound = false;
    let endSnippetFound = false;
    let lineNumber = 0;
    let snippet;
    const snippets = new Array();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line) => {
        lineNumber++;
        const numberedLine = { lineNumber, line };
        if (!skipLine(line)) {
            startSnippetFound = startSnippetFound || line.indexOf(startSnippetToken) > -1;
            endSnippetFound = line.indexOf(endSnippetToken) > -1;
            if (startSnippetFound) {
                if (!snippet) {
                    snippet = new Array();
                    snippets.push(snippet);
                }
                if (endSnippetFound) {
                    snippet.push(numberedLine);
                }
            }
            if (startSnippetFound && !endSnippetFound) {
                snippet.push(numberedLine);
            }
            if (endSnippetFound) {
                startSnippetFound = false;
                endSnippetFound = false;
                snippet = null;
            }
        }
    });
    rl.on('close', () => callback(filePath, snippets));
}
// ======================  Writes a file with a given content =========================
// Writes a file with a specific content
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
//# sourceMappingURL=ori.fs-observables.ori.js.map