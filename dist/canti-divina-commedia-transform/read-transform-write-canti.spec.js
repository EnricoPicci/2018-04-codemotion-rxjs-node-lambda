"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const config_1 = require("../config");
const fs_observables_1 = require("../fs-observables/fs-observables");
const read_transform_write_canti_1 = require("./read-transform-write-canti");
describe('readTransformWriteCanti function', () => {
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles;
        fs_observables_1.deleteDirObs(config_1.config.divinaCommediaCantiTransformedDir)
            .switchMap(_dirDeleted => fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiDir))
            .map(files => numberOfSourceFiles = files.length)
            .switchMap(_data => read_transform_write_canti_1.readTransformWriteCanti())
            .subscribe(undefined, err => done(err), () => {
            let numberOfTransformedFiles;
            fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiTransformedDir)
                .subscribe(files => numberOfTransformedFiles = files.length, err => done(err), () => {
                // adds the log file to the number of expected files
                const expectedWrittenFiles = numberOfSourceFiles + 1;
                if (numberOfTransformedFiles !== expectedWrittenFiles) {
                    console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to the expected number files ' + expectedWrittenFiles);
                    done(new Error('readTransformWriteCanti failed'));
                }
                else {
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=read-transform-write-canti.spec.js.map