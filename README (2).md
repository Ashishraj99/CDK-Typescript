
## Installation

Install my-project with npm

```
npm install -g aws-cdk

```
Create new Directory

```
mkdir MyProject
cd MyProject

```
Install Necessary Package

```
cdk init app --language typescript
npm install @aws-cdk/aws-ecs @aws-cdk/aws-ec2 @aws-cdk/aws-ecr-assets @aws-cdk/aws-ecs-patterns

```
Go to lib/stack.ts replace the content with existing code to new

After that run the stack

```
cdk bootstrap
cdk deploy

```
If in some case you want to delet use

```
cdk destroy

```



