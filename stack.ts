import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';

export class MyEcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC with 2 public and 2 private subnets
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyCluster', {
      vpc: vpc,
    });

    // Task Definition with ECR sample image
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'MyTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    taskDefinition.addContainer('MyContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
      portMappings: [{ containerPort: 8080 }],
    });

    // Create Fargate Service in the private subnet
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      desiredCount: 2,
      publicLoadBalancer: true,
    });

    // Set the listener port to 8080
    fargateService.listener.addTargets('ECS', {
      port: 80,
      targets: [fargateService.service],
    });
  }
}

const app = new cdk.App();
new MyEcsStack(app, 'MyEcsStack');
app.synth();
