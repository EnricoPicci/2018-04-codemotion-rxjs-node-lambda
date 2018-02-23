// import 'mocha';

// import {config} from '../config';
// import {fileListObs} from '../fs-observables/fs-observables';
// import {deleteDirObs} from '../fs-observables/fs-observables';
// import {duplicateCanti} from './create-many-files';

// describe('duplicateCanti function', () => {
    
//     it('creates many copies of the divina commedia canti files', done => {
//         const iterations = 100;
//         deleteDirObs(config.divinaCommediaCantiDirMany)
//         .switchMap(_dirDeleted => duplicateCanti(iterations))
//         .subscribe(
//             undefined,
//             err => done(err),
//             () => {
//                 let numberOfWrittenFiles: number;
//                 fileListObs(config.divinaCommediaCantiDirMany)
//                 .subscribe (
//                     files => numberOfWrittenFiles = files.length,
//                     err => done(err),
//                     () => {
//                         if (numberOfWrittenFiles !== 100 * iterations) {
//                             console.error('number of transformed files ' + numberOfWrittenFiles + ' not as expected');
//                             done(new Error('duplicateCanti failed'));
//                         } else {
//                             done();
//                         }
//                     }
//                 )
//             }
//         )
//     });

// });
