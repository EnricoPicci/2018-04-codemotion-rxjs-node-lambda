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
        extract_canti_1.extractCanti('./la_divin.txt')
            .subscribe(canti => {
            if (canti.length !== 100) {
                console.error(canti);
                return done(new Error('canti length ' + canti.length + ' expected 100'));
            }
            else {
                return done();
            }
        });
    });
});
//# sourceMappingURL=extract-canti.spec.js.map