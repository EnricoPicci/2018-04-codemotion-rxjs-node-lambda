"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {deleteDirObs} from '../fs-observables/fs-observables';
const read_transform_write_canti_blocks_1 = require("./read-transform-write-canti-blocks");
const config_1 = require("../config");
const start = Date.now();
read_transform_write_canti_blocks_1.readTransformWriteCantiBlocks(10000, config_1.config.divinaCommediaCantiDirMany)
    .subscribe(undefined, err => console.error(err), () => {
    const end = Date.now();
    console.log('done');
    console.log('elapsed ' + (end - start));
});
//# sourceMappingURL=_script-blocks.js.map