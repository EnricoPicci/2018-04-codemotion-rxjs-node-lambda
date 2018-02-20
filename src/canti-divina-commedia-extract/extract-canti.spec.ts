
import 'mocha';
import { expect } from 'chai';
import * as rimraf from 'rimraf';

import {isFirstLineOfCanto, extractCanti, writeAllCanti} from './extract-canti';

import {config} from '../config';

describe('isFirstLineOfCanto function', () => {
    
    it('returns false since it is not the first line of a Canto', () => {
        const line = '  Nel mezzo del cammin di nostra vita';
        expect(isFirstLineOfCanto(line)).to.be.false;
    });

    it('returns true since it not the first line of a Canto', () => {
        const line = 'CANTO PRIMO';
        expect(isFirstLineOfCanto(line)).to.be.true;
    });

});

describe('extractCanti function', () => {
    
    it('reads the Divina Commedia text and splits it in Canti', done => {
        extractCanti(config.divinaCommediaTextSource)
            .subscribe(
                canti => {
                    if (canti.length !== 100) {
                        console.error(canti);
                        return done(new Error('canti length ' + canti.length + ' expected 100'));
                    }
                    const primoCantoInferno = canti[0];
                    if (primoCantoInferno.content.length !== 137) {
                        console.error(primoCantoInferno);
                        return done(new Error('primoCantoInferno length ' + primoCantoInferno.content.length + ' expected 137'));
                    }
                    const t = primoCantoInferno[primoCantoInferno.content.length - 1];
                    console.log(t);
                    const primoCantoInfernoLastLine = primoCantoInferno.content[primoCantoInferno.content.length - 1].trim();
                    if (primoCantoInfernoLastLine !== 'Allor si mosse, e io li tenni retro.') {
                        console.error(primoCantoInfernoLastLine);
                        return done(new Error('primoCantoInfernoLastLine ' + primoCantoInfernoLastLine + ' not as expected'));
                    }
                    const firstCantoPurgatorio = canti[34];
                    const firstLineFirstCantoPurgatorio = firstCantoPurgatorio.content[0].trim();
                    if (firstLineFirstCantoPurgatorio !== 'CANTO PRIMO') {
                        console.error(firstLineFirstCantoPurgatorio);
                        return done(new Error('firstLineFirstCantoPurgatorio ' + firstLineFirstCantoPurgatorio + ' not as expected'));
                    }
                    const lastCantoParadiso = canti[99];
                    const lastCantoParadisoLastLine = lastCantoParadiso.content[lastCantoParadiso.content.length - 1].trim();
                    if (lastCantoParadisoLastLine !== 'l\'amor che move il sole e l\'altre stelle.') {
                        console.error(lastCantoParadisoLastLine);
                        return done(new Error('lastCantoParadisoLastLine ' + lastCantoParadisoLastLine + ' not as expected'));
                    }
                    return done();
                }
            )
    });

});


describe('writeAllCanti function', () => {
    
    it('writes all canti as separate files', done => {
        const outputDir = config.divinaCommediaCantiDir;
        // delete the target directory if it exists
        rimraf(outputDir, err => {
            if (err) {
                console.error('code', err.name);
                console.error('err', err);
                return done(err);
            }
            let cantiCounter = 0;
            writeAllCanti(config.divinaCommediaTextSource, outputDir)
                .subscribe(
                    _cantoTitle => cantiCounter++,
                    err => console.error(err),
                    () => {
                        if (cantiCounter !== 100) {
                            console.error('Not all canti files have been written', cantiCounter);
                            return done(new Error('write canti failed'));
                        }
                        return done();
                    }
                )
        });

    });

});
