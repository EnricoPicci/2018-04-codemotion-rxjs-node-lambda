import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import * as fs from 'fs';
import * as readline from 'readline';
import * as dir from 'node-dir';
import * as mkdirp from 'mkdirp';

// ============  Retrieves the names of the files present in a directory and subdirectories =========
// returns and Observable which emits for each file found in the directory and all its subdirectories
export function filesObs(fromDirPath: string) {
    return fileListObs(fromDirPath)
            .switchMap(files => Observable.from(files));
}
// returns and Observable which emits once with the list of files found in the directory and all its subdirectories
export function fileListObs(fromDirPath: string) {
    return _fileListObs(fromDirPath);
}
const _fileListObs = Observable.bindNodeCallback(dir.files);

// ============  Reads a file  =========
// returns and Observable which emits when the content of the file is read
export const readFileObs = Observable.bindNodeCallback(fs.readFile);


// =============================  Read a file line by line =========================================
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



// =============================  Select snippets contained in a file =========================================
// Returns an Observable which emits any time a file containing a snippet is found
// The returned observable is of type Observable<[]>
// the Array emitted by the Observable contains 2 items:
//  first item: is the name of the file which contains the snippets
//  second item: an array of arrays of NumberedLine
//                each array represents a snippet
//                each NumberedLine in the array represents a line of the file
export function findSnippetsObs(
    fromDirPath: string,
    startSnippet: string,
    endSnippet: string,
    skipLine?: (line: string) => boolean)
{
    return fileListObs(fromDirPath)
            .switchMap(fileList => readFileSnippetsObs(fileList, startSnippet, endSnippet, skipLine))
            .filter(fileAndSnippet => fileAndSnippet.snippets.length > 0)
}
export interface NumberedLine {
    lineNumber: number,
    line: string
}
export function readFileSnippetsObs(
    fileList: Array<string>,
    startSnippet: string,
    endSnippet: string,
    skipLine?: (line: string) => boolean) 
{
    return Observable.from(fileList)
            .mergeMap(filePath => _findSnippetsObs(filePath, startSnippet, endSnippet, skipLine));
}
        // the selector used as the second parameter in the bindCallback method is required to have 
        // the right inference from intellisense
        // https://stackoverflow.com/questions/47402073/inference-with-typescript-observable-and-bindcallback-method/47403711#47403711
const _findSnippetsObs = Observable.bindCallback(
                                        _findSnippets,
                                        (filePath: string, snippets: Array<Array<NumberedLine>>) => ( {filePath, snippets} )
                                    );
function _findSnippets(
    filePath: string,
    startSnippetToken: string,
    endSnippetToken: string,
    skipLine: (line: string) => boolean,
    callback: (filePath: string, snippets: Array<Array<NumberedLine>>) => void
) {
    if(!skipLine) {
        skipLine = (_line: string) => false;
    }
    let startSnippetFound = false;
    let endSnippetFound = false;
    let lineNumber = 0;
    let snippet: Array<NumberedLine>;
    const snippets = new Array<Array<NumberedLine>>();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line: string)  => {
        lineNumber++;
        const numberedLine: NumberedLine = {lineNumber, line};
        if (!skipLine(line)) {
            startSnippetFound = startSnippetFound || line.indexOf(startSnippetToken) > -1;
            endSnippetFound = line.indexOf(endSnippetToken) > -1;
            if (startSnippetFound) {
                if (!snippet) {
                    snippet = new Array<NumberedLine>();
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
    rl.on('close', ()  => callback(filePath, snippets));
}


// ======================  Writes a file with a given content =========================
// Writes a file with a specific content
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




