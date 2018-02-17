
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';

import * as fs from 'fs';
import * as readline from 'readline';


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

