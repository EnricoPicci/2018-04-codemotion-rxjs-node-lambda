// import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';
import { APIGatewayEvent, Callback} from 'aws-lambda';

import {readLinesTest} from './src/test-services';
import {fileListTest} from './src/test-services';
import {writeFileTest} from './src/test-services';
import {transformTest} from './src/test-services';
import {transformBlocksTest} from './src/test-services';


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



// export const addUser: Handler = (event : APIGatewayEvent, context : Context, callback : Callback) => {
//   const data = JSON.parse(event.body);
//   const result = addUserImpl(data);
//   const isError = result instanceof FunctionProcessingError;
//   let response;
//   if (isError) {
//     response = {
//       statusCode: 499,
//       body: JSON.stringify({
//         message: 'ERROR Serverless' + '\n' + result.message,
//         input: event,
//       }),
//     };
//   } else {
//     response = {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'Serverless addUser function - completed successfully',
//         result,
//       }),
//     };
//   }


//   callback(null, response);

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
// };
