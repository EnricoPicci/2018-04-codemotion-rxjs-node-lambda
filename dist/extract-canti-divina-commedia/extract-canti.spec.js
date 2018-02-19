"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const extract_canti_1 = require("./extract-canti");
describe('isFirstLineOfCanto function', () => {
    it('returns false since it is not the first line of a Canto', () => {
        const line = '  Nel mezzo del cammin di nostra vita';
        chai_1.expect(extract_canti_1.isFirstLineOfCanto(line)).to.be.false;
    });
    it('returns true since it not the first line of a Canto', () => {
        const line = 'CANTO PRIMO';
        chai_1.expect(extract_canti_1.isFirstLineOfCanto(line)).to.be.true;
    });
});
describe('extractCanti function', () => {
    it('reads the Divina Commedia text and splits it in Canti', done => {
        extract_canti_1.extractCanti('./src/extract-canti-divina-commedia/la_divin.txt')
            .subscribe(canti => {
            if (canti.length !== 100) {
                console.error(canti);
                return done(new Error('canti length ' + canti.length + ' expected 100'));
            }
            const primoCantoInferno = canti[0];
            if (primoCantoInferno.length !== 137) {
                console.error(primoCantoInferno);
                return done(new Error('primoCantoInferno length ' + primoCantoInferno.length + ' expected 137'));
            }
            const primoCantoInfernoLastLine = primoCantoInferno[primoCantoInferno.length - 1].trim();
            if (primoCantoInfernoLastLine !== 'Allor si mosse, e io li tenni retro.') {
                console.error(primoCantoInfernoLastLine);
                return done(new Error('primoCantoInfernoLastLine ' + primoCantoInfernoLastLine + ' not as expected'));
            }
            const firstCantoPurgatorio = canti[34];
            const firstLineFirstCantoPurgatorio = firstCantoPurgatorio[0].trim();
            if (firstLineFirstCantoPurgatorio !== 'CANTO PRIMO') {
                console.error(firstLineFirstCantoPurgatorio);
                return done(new Error('firstLineFirstCantoPurgatorio ' + firstLineFirstCantoPurgatorio + ' not as expected'));
            }
            const lastCantoParadiso = canti[99];
            const lastCantoParadisoLastLine = lastCantoParadiso[lastCantoParadiso.length - 1].trim();
            if (lastCantoParadisoLastLine !== 'l\'amor che move il sole e l\'altre stelle.') {
                console.error(lastCantoParadisoLastLine);
                return done(new Error('lastCantoParadisoLastLine ' + lastCantoParadisoLastLine + ' not as expected'));
            }
            return done();
        });
    });
});
//# sourceMappingURL=extract-canti.spec.js.map