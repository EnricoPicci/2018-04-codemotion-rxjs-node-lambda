import { APIGatewayEvent, Context, Handler, Callback } from 'aws-lambda';

import {readLinesTest} from './src/test-services';
import {fileListTest} from './src/test-services'
// import {FunctionProcessingError} from './src/function-processing-error';

export const readLinesOfOneFile = (event, context, callback) => {
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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

export const listFilesOfOneBucket = (event, context, callback) => {
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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
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
