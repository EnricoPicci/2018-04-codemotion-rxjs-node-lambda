"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const config_1 = require("../config");
const fs_observables_1 = require("../fs-observables/fs-observables");
const read_transform_write_canti_1_1 = require("./read-transform-write-canti-1");
describe('readTransformWriteCanti1 function', () => {
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles;
        fs_observables_1.deleteDirObs(config_1.config.divinaCommediaCantiTransformedDir1)
            .switchMap(_dirDeleted => fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiDir))
            .map(files => numberOfSourceFiles = files.length)
            .switchMap(_data => read_transform_write_canti_1_1.readTransformWriteCanti1())
            .subscribe(undefined, err => done(err), () => {
            let numberOfTransformedFiles;
            fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiTransformedDir1)
                .subscribe(files => numberOfTransformedFiles = files.length, err => done(err), () => {
                if (numberOfTransformedFiles !== numberOfSourceFiles) {
                    console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to number of source files ' + numberOfSourceFiles);
                    done(new Error('readTransformWriteCanti1 failed'));
                }
                else {
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=read-transform-write-canti-1.spec.js.map