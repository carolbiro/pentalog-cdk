#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PentalogCdkStack } from "../lib/pentalog-cdk-stack";

const app = new cdk.App();
new PentalogCdkStack(app, "PentalogCdkStack", {
  synthesizer: new cdk.DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
});

app.synth();
