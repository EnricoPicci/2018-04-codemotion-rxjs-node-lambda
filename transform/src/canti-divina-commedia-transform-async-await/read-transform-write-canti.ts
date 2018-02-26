
import {filesPromise} from '../fs-async-await/fs-promise';
import {readLinesPromise} from '../fs-async-await/fs-promise';
import {writeFilePromise} from '../fs-async-await/fs-promise';
import {appendFilePromise} from '../fs-async-await/fs-promise';

import {transformCanto} from './transform-canto';
import {config} from '../config';

export async function readTransformWriteCanti(inputDir?: string) {
    const sourceDir = inputDir ? inputDir : config.divinaCommediaCantiDir;
    const files = await filesPromise(sourceDir);
    const promises = new Array<Promise<any>>();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(readTransformWriteCanto(file, i));
    }
    return Promise.all(promises)
}

export async function readTransformWriteCanto(filePath: string, sequence: number) {
    const targetDir = config.divinaCommediaCantiTransformedDirAsyncAwait;
    const logFile = targetDir + 'log.txt';
    const cantoLines = await readLinesPromise(filePath);
    const transformedCanto = transformCanto({name: filePath, content: cantoLines.lines, sequence}, targetDir);
    const fileTransformed = await writeFilePromise(transformedCanto.name, transformedCanto.content);
    return appendFilePromise(logFile, fileTransformed);
}
