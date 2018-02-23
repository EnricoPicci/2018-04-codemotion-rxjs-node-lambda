
import {readLinesObs} from './aws-s3-observable';
import {fileListObs} from './aws-s3-observable';

export function readLinesTest() {
    console.log('readFile start');
    return readLinesObs('transform-aws-dev-uploadbucket-1goif1vteiz8c', 'test');
}

export function fileListTest() {
    console.log('fileListTest start');
    return fileListObs('transform-aws-dev-uploadbucket-1goif1vteiz8c');
}
