
// import {deleteDirObs} from '../fs-observables/fs-observables';
import {readTransformWriteCantiBlocks} from './read-transform-write-canti-blocks';
import {config} from '../config';

const start = Date.now();
readTransformWriteCantiBlocks(10000, config.divinaCommediaCantiDirMany)
.subscribe(
    undefined,
    err => console.error(err),
    () => {
        const end = Date.now();
        console.log('done');
        console.log('elapsed ' + (end - start));
    }
)
