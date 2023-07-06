import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class PentalogCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new NodejsFunction(this, "PentalogCdkLambda", {
      entry: "lambda/index.ts", // Replace with the actual path to your Lambda function code
      handler: "handler",
      runtime: Runtime.NODEJS_14_X,
    });

    const api = new LambdaRestApi(this, "PentalogCdkApi", {
      handler,
      proxy: false,
    });

    const planResource = api.root.addResource("plan"); // Add 'plan' resource
    planResource.addMethod("GET", new LambdaIntegration(handler));
  }
}
