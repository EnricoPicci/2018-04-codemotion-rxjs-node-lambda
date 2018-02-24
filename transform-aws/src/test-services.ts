
import 'rxjs/add/operator/switchMap';

import {readLinesObs} from './aws-s3-observable';
import {fileListObs} from './aws-s3-observable';
import {writeFileObs} from './aws-s3-observable';

import {readTransformWriteCanti} from './transform';

const testReadBucketName = 'transform-aws-dev-uploadbucket-1goif1vteiz8c';
const testWriteBucketName = 'transform-aws-dev-write-bucket-1goif1vteiz8c';

export function readLinesTest() {
    console.log('readFile start');
    return readLinesObs(testReadBucketName, 'test');
}

export function fileListTest() {
    console.log('fileListTest start');
    return fileListObs(testReadBucketName);
}

export function writeFileTest() {
    console.log('writeFileTest start');
    return readLinesObs(testReadBucketName, 'test')
            .map (lines => {
                const firstString = Date.now() + '\n';
                return [firstString].concat(lines)
            })
            .switchMap(lines => writeFileObs(testWriteBucketName, 'new-test', lines));
}

export function transformTest() {
    console.log('transformTest start');
    return readTransformWriteCanti();
}