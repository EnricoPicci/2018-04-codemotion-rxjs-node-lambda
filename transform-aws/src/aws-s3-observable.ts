
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import AWS = require('aws-sdk');
import { GetObjectRequest, GetObjectOutput, ListObjectsRequest, ListObjectsOutput } from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk/lib/error';

const s3 = new AWS.S3();

export function readLinesObs(bucket: string, name: string) {
    return _readLinesObs(bucket, name)
            .map(data => data.Body.toString())
            .map(data => data.split('\n'));
}
const _readLinesObs = Observable.bindNodeCallback(_getObject);
function _getObject(bucket: string, key: string, cb: (err: AWSError, result: GetObjectOutput) => void) {
    const request: GetObjectRequest = {
        Bucket: bucket, 
        Key: key
    };
    return s3.getObject(request, cb);
}



export function fileListObs(bucket: string) {
    return _fileListObs(bucket)
            .do(data => console.log('data 1', data))
            .map(data => data.Contents)
            .do(data => console.log('data 2', data))
            .map(data => data.map(objInfo => objInfo.Key));
}
const _fileListObs = Observable.bindNodeCallback(_fileList);
function _fileList(bucket: string, cb: (err: AWSError, result: ListObjectsOutput) => void) {
    const request: ListObjectsRequest = {
        Bucket: bucket
    };
    return s3.listObjects(request, cb);
}
