"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const config_1 = require("../config");
const fs_observables_1 = require("../fs-observables/fs-observables");
const fs_observables_2 = require("../fs-observables/fs-observables");
const read_transform_write_canti_blocks_1 = require("./read-transform-write-canti-blocks");
describe('readTransformWriteCantiBlocks function', () => {
    it('transforms the Canti and writes them in a new directory - checks if the number of transformed files is correct', done => {
        let numberOfSourceFiles;
        fs_observables_2.deleteDirObs(config_1.config.divinaCommediaCantiTransformedDirBlocks)
            .switchMap(_dirDeleted => fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiDir))
            .map(files => numberOfSourceFiles = files.length)
            .switchMap(_data => read_transform_write_canti_blocks_1.readTransformWriteCantiBlocks(20))
            .subscribe(undefined, err => done(err), () => {
            let numberOfTransformedFiles;
            fs_observables_1.fileListObs(config_1.config.divinaCommediaCantiTransformedDirBlocks)
                .subscribe(files => numberOfTransformedFiles = files.length, err => done(err), () => {
                // adds the log file to the number of expected files
                const expectedWrittenFiles = numberOfSourceFiles + 1;
                if (numberOfTransformedFiles !== expectedWrittenFiles) {
                    console.error('number of transformed files ' + numberOfTransformedFiles + ' not equal to number of source files ' + numberOfSourceFiles);
                    done(new Error('readTransformWriteCantiBlocks failed'));
                }
                else {
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=read-transform-write-canti-blocks.spec.js.map