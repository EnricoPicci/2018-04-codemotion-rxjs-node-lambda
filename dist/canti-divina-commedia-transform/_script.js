"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_transform_write_canti_1 = require("./read-transform-write-canti");
const config_1 = require("../config");
const start = Date.now();
// readTransformWriteCanti()
read_transform_write_canti_1.readTransformWriteCanti(config_1.config.divinaCommediaCantiDirMany)
    .subscribe(undefined, err => console.error(err), () => {
    const end = Date.now();
    console.log('done');
    console.log('elapsed ' + (end - start));
});
//# sourceMappingURL=_script.js.map