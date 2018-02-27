# 2018-04-codemotion-rxjs-node
code for codemotion rome on RxJs and Node

To setup the serverless framework on your machine, follow the instructions outlined in the first part of this article
https://hackernoon.com/a-crash-course-on-serverless-with-node-js-632b37d58b44

Download the project from NPM and install all dependencies

To deploy the lambda functions on AWS you need to run the following command
"serverless deploy"
this command does:
- typescript compilation
- build of single packages for each function via webpack
- deploy of the functions into AWS
