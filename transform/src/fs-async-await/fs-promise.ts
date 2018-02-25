
import * as dir from 'node-dir';
import * as readline from 'readline';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';

//============  Returns the list of names of the files present in a directory and subdirectories =========
export function filesPromise(fromDirPath: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
        dir.files(fromDirPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        });
    })
}

// =============================  Read a file line by line =========================================
export function readLinesPromise(filePath: string): Promise<{lines: Array<string>, filePath: string}> {
    const lines = new Array<string>();
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    rl.on('line', (line: string)  => {
        lines.push(line);
    });
    return new Promise(function(resolve, _reject) {
        rl.on('close', ()  => {
            resolve({lines, filePath});
        })
    });
}

// ======================  Writes an array of strings as lines in a file =========================
export function writeFilePromise(filePath: string, lines: Array<string>): Promise<string> {
    return new Promise(function(resolve, reject) {
        const lastSlash = filePath.lastIndexOf('/');
        const fileDir = filePath.substr(0, lastSlash + 1);
        mkdirp(fileDir, err => {
            if (err) {
                console.error('error in creating a directory', err);
                throw err;
            }
            const fileContent = lines.join('\n');
            fs.writeFile(filePath, fileContent, err => {
                if (err) return reject(err);
                resolve(filePath);
            })
        });
    });
}

// ============  Creates a directory =========
export function makeDirPromise(dirPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        mkdirp(dirPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(dirPath);
        });
    })
}

// ============  Deletes a directory and its subdirectories  =========
export function deleteDirPromise(dirPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rimraf(dirPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(dirPath);
        });
    })
}

// ============  Append a line at the end of a file  =========
export function appendFilePromise(filePath: string, line: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.appendFile(filePath, line, err => {
            if (err) {
                return reject(err);
            }
            resolve(line);
        });
    })
}

// ============  Deletes a file =========
export function deleteFilePromise(filePath: string) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
            if (err) {
                return reject(err);
            }
            resolve(filePath);
        });
    })
}
