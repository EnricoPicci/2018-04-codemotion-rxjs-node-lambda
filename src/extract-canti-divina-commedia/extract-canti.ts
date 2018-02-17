
import 'rxjs/add/operator/map';

import {readLinesObs} from '../fs-observables/fs-observables';

interface NumberedLine {
    lineNumber: number,
    line: string
}

export function extractCanti(divinaCommediaText: string) {
    return readLinesObs(divinaCommediaText)
            .map(lines => lines.filter(line => line.trim().length > 0))
            .map(lines => lines.filter(line => ['INFERNO', 'PURGATORIO', 'PARADISO'].indexOf(line.trim()) === -1))
            .map(lines => splitCanti(lines))
}

function splitCanti(lines: Array<string>) {
    const canti = new Array<Array<NumberedLine>>();
    let canto: Array<NumberedLine>;
    let numberedLine: NumberedLine;
    let lineNumber: number;
    for (const line of lines) {
        if (isFirstLineOfCanto(line)) {
            if (canto) {
                canti.push(canto);
            }
            canto = new Array<NumberedLine>();
            lineNumber = 1;
            numberedLine = {lineNumber, line};
            canto.push(numberedLine);
        } else {
            if (canto) {
                lineNumber++;
                numberedLine = {lineNumber, line};
                canto.push(numberedLine);
            }
        }
    }
    canti.push(canto);
    return canti;
}

export function isFirstLineOfCanto(line: string) {
    return line.indexOf('CANTO') > -1;
}
