// import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { APIGatewayEvent, Callback} from 'aws-lambda';

import {readLinesTest} from './src/test-services';
import {fileListTest} from './src/test-services';
import {writeFileTest} from './src/test-services';
import {transformTest} from './src/test-services';
import {transformBlocksTest} from './src/test-services';
import {transformConcurrencyTest} from './src/test-services';


export const readLinesOfOneFile = (_event, _context, callback: Callback) => {
  let message: any;
  readLinesTest()
  .subscribe(
    data => message = data,
    err => message = err,
    () => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test readLinesOfOneFile function',
          data: message,
        }),
      };
      callback(null, response);
    }
  );
};

export const listFilesOfOneBucket = (_event, _context, callback: Callback) => {
  let message: any;
  fileListTest()
  .subscribe(
    data => message = data,
    err => console.error('listFilesOfOneBucket error', err),
    () => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test fileListTest function',
          data: message,
        }),
      };
      callback(null, response);
    }
  );
};

export const readAndWriteOneFile = (_event, _context, callback: Callback) => {
  let message: any;
  writeFileTest()
  .subscribe(
    data => message = data,
    err => console.error('readAndWriteOneFile error', err),
    () => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test readAndWriteOneFile function',
          data: message,
        }),
      };
      callback(null, response);
    }
  );
};


export const transform = (_event, _context, callback: Callback) => {
  const transformedFiles = new Array<string>();
  transformTest()
  .subscribe(
    data => transformedFiles.push(data),
    err => console.error('transform error', err),
    () => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test transform function',
          data: transformedFiles,
        }),
      };
      callback(null, response);
    }
  );
};


export const transformBlocks = (event: APIGatewayEvent, _context, callback: Callback) => {
  const transformedFiles = new Array<string>();
  const blockSize = parseInt(event.queryStringParameters.size);
  const start = Date.now();
  transformBlocksTest(blockSize)
  .subscribe(
    data => transformedFiles.push(data),
    err => console.error('transformBlocks error', err),
    () => {
      const end = Date.now();
      const duration = end - start;
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test transformBlocks function',
          data: {duration, transformedFiles},
        }),
      };
      callback(null, response);
    }
  );
};


export const transformConcurrency = (event: APIGatewayEvent, _context, callback: Callback) => {
  const transformedFiles = new Array<string>();
  let concurrencyLevel: number;
  if (event.queryStringParameters) {
    concurrencyLevel = parseInt(event.queryStringParameters.concurrencylevel);
  }
  console.log('concurrencyLevel', concurrencyLevel);
  const start = Date.now();
  transformConcurrencyTest(concurrencyLevel)
  .subscribe(
    data => transformedFiles.push(data),
    err => console.error('transformConcurrency error', err),
    () => {
      const end = Date.now();
      const duration = end - start;
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless v1.0! I test transformConcurrency function',
          data: {duration, transformedFiles},
        }),
      };
      callback(null, response);
    }
  );
};
