
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';

import {readLinesObs, writeFileObs} from '../fs-observables/fs-observables';

import {Cantica, Canto} from '../canti-divina-commedia-model/canti-divina-commedia-model';

export function extractCanti(divinaCommediaText: string): Observable<Array<Canto>> {
    return readLinesObs(divinaCommediaText)
            .map(lines => lines.filter(line => line.trim().length > 0))
            .map(lines => lines.filter(line => ['INFERNO', 'PURGATORIO', 'PARADISO'].indexOf(line.trim()) === -1))
            .map(lines => splitCanti(lines))
            .map(linesOfCanti => linesOfCanti
                                    .map((linesOfCanto, sequence) => {
                                        return {name: linesOfCanto[0], content: linesOfCanto, sequence: sequence + 1};
                                    }))
}

function splitCanti(lines: Array<string>) {
    const canti = new Array<Array<string>>();
    let canto: Array<string>;
    for (const line of lines) {
        if (isFirstLineOfCanto(line)) {
            if (canto) {
                canti.push(canto);
            }
            canto = new Array<string>();
            canto.push(line);
        } else {
            if (canto) {
                canto.push(line);
            }
        }
    }
    canti.push(canto);
    return canti;
}

export function isFirstLineOfCanto(line: string) {
    return line.indexOf('CANTO') > -1;
}

export function writeAllCanti(divinaCommediaTextFileName: string, outputDir: string) {
    const lastCharOfDirName = outputDir[outputDir.length - 1];
    const dirNameWithSlash = lastCharOfDirName === '/' ? outputDir : outputDir + '/';
    return extractCanti(divinaCommediaTextFileName)
            .map(allCanti => cantiche(allCanti))
            .switchMap(cantiche => Observable.from(cantiche))
            .mergeMap(canti => writeCantica(canti, dirNameWithSlash))
}
function writeCantica(cantica: Cantica, outputDir: string) {
    return Observable.from(cantica.canti)
            .mergeMap(canto => {
                let sequenceString = canto.sequence + '';
                sequenceString = sequenceString.length === 1 ? '0' + sequenceString : sequenceString;
                const cantoTitle = sequenceString + ' - ' + cantica.name + ' - ' + canto.name;
                return writeCanto(cantoTitle, canto.content, outputDir);
            });
}
function writeCanto(title: string, content: Array<string>, outputDir: string) {
    const fileName = outputDir + title + '.txt';
    return writeFileObs(fileName, content);
}

export function cantiche(allCanti: Array<Canto>) {
    const cantiche = Array<Cantica>();
    cantiche.push(inferno(allCanti));
    cantiche.push(purgatorio(allCanti));
    cantiche.push(paradiso(allCanti));
    return cantiche;
}
function inferno(allCanti: Array<Canto>) {
    return {name: 'Inferno', canti: allCanti.slice(0, 34)}
}
function purgatorio(allCanti: Array<Canto>) {
    return {name: 'Purgatorio', canti: allCanti.slice(34, 67)}
}
function paradiso(allCanti: Array<Canto>) {
    return {name: 'Paradiso', canti: allCanti.slice(67, 100)}
}
