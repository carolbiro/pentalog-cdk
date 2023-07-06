# Welcome to your Pentalog-cdk TypeScript project

This is a project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## How to setup

Run the following commands to setup, given `node` , `npm` and `cdk` is available:

1. git clone https://github.com/carolbiro/pentalog-cdk.git
1. cd pentalog-cdk
1. npm install
1. npm run build
1. cdk deploy

## Running tests

* To run the tests run `npm test` on the project root.

## Deploying

Run the following commands to deploy to an AWS account in the project's root folder

1. npm run build
1. cdk deploy
1. after deployment in AWS API Gateway the method can be tested with the following query string: `from=60.148156622692035,%2024.987887975719225&to=60.19461994799159,%2024.870836734771732&date=24-12-2023`

## Implementation and tradeoffs

1.Code Structure and Organization:

* The code structure is like a typical AWS CDK project structure, with separate folders for Lambda functions, infrastructure stacks, and the main entry point (bin folder).
* The separation of the Lambda function code into its own file (lambda/index.ts) allows for better code organization and maintainability. If there were more lambdas in the project I would extract them in a folder called src containing src/lambda1, src/lambda2 ... folders
* The use of separate helper files (types.ts and utils.ts) for type definitions and constants improves code readability and reusability.

2.Lambda Function:

* The Lambda function handles the API Gateway requests and interacts with the OpenTripPlanner2 server.
* The function validates the incoming query parameters and makes the API call to the OpenTripPlanner2 server using axios.
* It calculates CO2 emissions based on the legs of the itinerary and returns a JSON response containing the route plan which respects the validation schema from the assignment.
* The error handling is done by catching exceptions and returning an appropriate response with a status code and error message.

3.Infrastructure Stack:

* The AWS CDK infrastructure stack (PentalogCdkStack) is responsible for defining the API Gateway and Lambda function resources.
* The Lambda function is deployed using the NodejsFunction construct from AWS CDK, which simplifies the deployment process by automatically bundling dependencies using webpack.
* The API Gateway is configured to use the Lambda function as the integration for the "GET /plan" endpoint.

4.Test:
* Test cases cover the basic functionality of the Lambda function by testing different scenarios. However, we could add more tests to further validate the behavior of the Lambda function. Some possible additional test cases could include:
1. testing different valid combinations of query parameters 
1. testing different date formats to ensure the Lambda function handles them correctly
1. checking the error handling and response for specific error scenarios.

## Areas of improvement

1. Error Handling: Consider improving the error handling by providing more informative error messages or logging detailed error information for troubleshooting purposes.
2. Security: Ensure that appropriate security measures are in place, such as proper handling of API keys and validating user inputs to prevent security vulnerabilities like injection attacks.
3. Deployment Pipeline: Set up a continuous integration and deployment (CI/CD) pipeline to automate the deployment process, including building, testing, and deploying the AWS CDK stack.
4. Performance Optimization: Analyze the performance of the Lambda function and the API Gateway to identify potential optimizations, such as caching, request/response compression, or provisioned concurrency, to improve overall system performance.