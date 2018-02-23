
import {readTransformWriteCanti} from './read-transform-write-canti';
import {config} from '../config';

const start = Date.now();
// readTransformWriteCanti()
readTransformWriteCanti(config.divinaCommediaCantiDirMany)
.subscribe(
    undefined,
    err => console.error(err),
    () => {
        const end = Date.now();
        console.log('done');
        console.log('elapsed ' + (end - start));
    }
)
