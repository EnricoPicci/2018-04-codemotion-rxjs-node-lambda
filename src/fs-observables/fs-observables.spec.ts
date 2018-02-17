
import 'mocha';

import {readLinesObs} from './fs-observables';

describe('readLinesObs function', () => {
    
    it('reads all the lines of a file', done => {
        const filePath = 'src/fs-observables/fs-observable-test-dir/dir-2/file-2-1.txt';
        readLinesObs(filePath).subscribe(
            lines => {
                console.log('lines', lines);
                if (lines.length !== 5) {
                    console.error(filePath, lines);
                    return done(new Error('lines count failed'));
                }
                return done();
            },
            err => {
                console.error('ERROR', err);
            },
            () => console.log('COMPLETED')
        );

    });

});

