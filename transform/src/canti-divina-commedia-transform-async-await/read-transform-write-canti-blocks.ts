
import * as _ from 'lodash';

import {filesPromise} from '../fs-async-await/fs-promise';
import {readLinesPromise} from '../fs-async-await/fs-promise';
import {writeFilePromise} from '../fs-async-await/fs-promise';
import {appendFilePromise} from '../fs-async-await/fs-promise';

import {transformCanto} from './transform-canto';
import {config} from '../config';

export async function readTransformWriteCantiBlocks(blockSize: number, inputDir?: string) {
    const sourceDir = inputDir ? inputDir : config.divinaCommediaCantiDir;
    const files = await filesPromise(sourceDir);
    const fileBlocks = _.chunk(files, blockSize)
    // https://stackoverflow.com/questions/47052929/how-to-execute-multiple-asynchronous-functions-sequentially-multiple-times
    let chainOfPromises = Promise.resolve(new Array<string>());
    for (const fileBlock of fileBlocks) {
        const parallelPromises = new Array<Promise<string>>();
        for (const file of fileBlock) {
            parallelPromises.push(readTransformWriteCanto(file));
        }
        const promiseForBlockFunction = () => Promise.all(parallelPromises);
        chainOfPromises = chainOfPromises.then(promiseForBlockFunction);
    }
    return chainOfPromises;
}

export async function readTransformWriteCanto(filePath: string) {
    const targetDir = config.divinaCommediaCantiTransformedDirAsyncAwaitBlock;
    const logFile = targetDir + 'log.txt';
    const cantoLines = await readLinesPromise(filePath);
    const transformedCanto = transformCanto({name: filePath, content: cantoLines.lines}, targetDir);
    const fileTransformed = await writeFilePromise(transformedCanto.name, transformedCanto.content);
    return appendFilePromise(logFile, fileTransformed);
}
