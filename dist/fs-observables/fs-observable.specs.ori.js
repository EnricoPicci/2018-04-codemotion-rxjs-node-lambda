// import 'mocha';
// import * as rimraf from 'rimraf';
// import {filesObs, fileListObs, findSnippetsObs, NumberedLine, writeFileObs, readLinesObs, readFileObs} from './fs-observables';
// describe('filesObs function', () => {
//     it('retrieves all files from a directory and its subdirectories and returns an observable which emits for every file retrieved', done => {
//         const sourceDir = './src/utils/fs-observables/fs-observable-test-dir';
//         const filePaths = new Array<string>();
//         filesObs(sourceDir).subscribe(
//             _filePath => filePaths.push(_filePath),
//             error => console.error(error),
//             () => {
//                 if (filePaths.length !== 3) {
//                     console.error(filePaths);
//                     return done(new Error('file count failed'));
//                 } else {
//                     return done();
//                 }
//             }
//         )
//     });
// });
// describe('fileListObs function', () => {
//     it('retrieves all files from a directory and its subdirectories and returns an observable which emits the list', done => {
//         const sourceDir = './src/utils/fs-observables/fs-observable-test-dir';
//         let fileList: Array<string>;
//         fileListObs(sourceDir).subscribe(
//             _fileList => {
//                 if (fileList) {
//                     console.error(fileList);
//                     return done(new Error('fileList emitted more than once'));
//                 }
//                 fileList = _fileList;
//             },
//             error => console.error(error),
//             () => {
//                 if (fileList.length !== 3) {
//                     console.error(fileList);
//                     return done(new Error('file count failed'));
//                 } else {
//                     return done();
//                 }
//             }
//         )
//     });
// });
// describe('findSnippetsObs function', () => {
//     it('reads the snippets present in the files contained by the directory and its subdirectories', done => {
//         const sourceDir = './src/utils/fs-observables/fs-observable-test-dir';
//         const snippets = new Array<{filePath: string, snippets: Array<Array<NumberedLine>>}>();
//         const startSnippetToken = 'Snippet start';
//         const endSnippetToken = 'Snippet end';
//         findSnippetsObs(sourceDir, startSnippetToken, endSnippetToken).subscribe(
//             fileAndSnippets => snippets.push(fileAndSnippets),
//             error => done(error),
//             () => {
//                 if (snippets.length !== 2) {
//                     console.error(snippets);
//                     return done(new Error('snippets count failed'));
//                 }
//                 const file_1_1_1_snippets = snippets.find(fileAndSnippets => 
//                                                                 fileAndSnippets.filePath === 'src/utils/fs-observables/fs-observable-test-dir/dir-1/dir-1-1/file-1-1-1.txt');
//                 if (file_1_1_1_snippets.snippets.length !== 2) {
//                     console.error(file_1_1_1_snippets);
//                     return done(new Error('snippets in file file-1-1-1.txt count failed'));
//                 }
//                 if (file_1_1_1_snippets.snippets[0].length !== 3) {
//                     console.error(file_1_1_1_snippets);
//                     return done(new Error('first snippet in file file-1-1-1.txt line count failed'));
//                 }
//                 const numberedLine: NumberedLine = file_1_1_1_snippets.snippets[0][0];
//                 if (numberedLine.lineNumber !== 4) {
//                     console.error(numberedLine);
//                     return done(new Error('first line lineCount failed'));
//                 }
//                 return done();
//             }
//         )
//     });
// });
// describe('findSnippetsObs function with skipLine', () => {
//     it('reads the snippets ignoring the lines starting with a * char', done => {
//         const sourceDir = './src/utils/fs-observables/fs-observable-test-dir';
//         const snippets = new Array<{filePath: string, snippets: Array<Array<NumberedLine>>}>();
//         const startSnippetToken = 'Snippet start';
//         const endSnippetToken = 'Snippet end';
//         const skipLine = (line) => { return line.length > 0 && line[0] === '*'}
//         findSnippetsObs(sourceDir, startSnippetToken, endSnippetToken, skipLine).subscribe(
//             fileAndSnippets => snippets.push(fileAndSnippets),
//             error => done(error),
//             () => {
//                 if (snippets.length !== 2) {
//                     console.error(snippets);
//                     return done(new Error('snippets count failed'));
//                 }
//                 const file_1_1_1_snippets = snippets.find(fileAndSnippets => 
//                                                                 fileAndSnippets.filePath === 'src/utils/fs-observables/fs-observable-test-dir/dir-1/dir-1-1/file-1-1-1.txt');
//                 if (file_1_1_1_snippets.snippets.length !== 1) {
//                     console.error(file_1_1_1_snippets);
//                     return done(new Error('snippets in file file-1-1-1.txt count failed'));
//                 }
//                 if (file_1_1_1_snippets.snippets[0].length !== 4) {
//                     console.error(file_1_1_1_snippets);
//                     return done(new Error('first snippet in file file-1-1-1.txt line count failed'));
//                 }
//                 const numberedLine: NumberedLine = file_1_1_1_snippets.snippets[0][0];
//                 if (numberedLine.lineNumber !== 9) {
//                     console.error(numberedLine);
//                     return done(new Error('first line lineCount failed'));
//                 }
//                 return done();
//             }
//         )
//     });
// });
// describe('writeFileObs function', () => {
//     it('writes a file with a certain content', done => {
//         const filePathDir = 'src/utils/fs-observables/fs-observable-test-dir-output/';
//         const fileName = 'file-w.txt';
//         const content = [
//             'first line',
//             'second line'
//         ];
//         rimraf(filePathDir, err => {
//             if (err && err.name !== 'ENOENT') {
//                 console.error('code', err.name);
//                 console.error('err', err);
//                 return done(err);
//             }
//             const fullFileName = filePathDir + fileName;
//             writeFileObs(fullFileName, content)
//                 .switchMap(_filePath => filesObs(filePathDir))
//                 .subscribe(filePath => {
//                     if (filePath !== fullFileName) {
//                         console.error('filePath', filePath);
//                         console.error('fullFileName', fullFileName);
//                         return done(new Error('write file failed'));
//                     }
//                     rimraf(filePathDir, err => {
//                         if (err) {
//                             console.error('err', err);
//                             return done(err);
//                         }
//                     });
//                     return done();
//                 })
//         });
//     });
// });
// describe('readLinesObs function', () => {
//     it('reads all the lines of a file', done => {
//         const filePath = 'src/utils/fs-observables/fs-observable-test-dir/dir-2/file-2-1.txt';
//         readLinesObs(filePath).subscribe(
//             lines => {
//                 console.log('lines', lines);
//                 if (lines.length !== 5) {
//                     console.error(filePath, lines);
//                     return done(new Error('lines count failed'));
//                 }
//                 return done();
//             },
//             err => {
//                 console.error('ERROR', err);
//             },
//             () => console.log('COMPLETED')
//         );
//     });
// });
// describe('readFileObs function', () => {
//     it('reads a file', done => {
//         const filePath = 'src/utils/fs-observables/fs-observable-test-dir/dir-2/file-2-1.txt';
//         readFileObs(filePath).subscribe(
//             content => {
//                 const contentAsString = content.toString('utf8');
//                 console.log('file content', contentAsString);
//                 if (contentAsString.length !== 38) {
//                     console.error(filePath, contentAsString);
//                     return done(new Error('file content length failed'));
//                 }
//                 return done();
//             },
//             err => {
//                 console.error('ERROR', err);
//             },
//             () => console.log('COMPLETED')
//         );
//     });
// });
//# sourceMappingURL=fs-observable.specs.ori.js.map