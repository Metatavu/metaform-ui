#!/usr/bin/node

const { spawn } = require('child_process');

const execCommand = async (command, args, opts) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, opts);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      console.log(chunk);
    });
    child.on('close', (code) => {
      if (code) {
        reject(`child process exited with code ${code}`);
      } else {
        resolve();
      }      
    });
  });
}

console.log("env", process.env);

(process.env._DEPLOYMENTS || "").split(' ').map(async deplyment => {
  console.log(`Deploying ${deplyment}`);

  try {
    const childEnv = {
      PATH: process.env.PATH,
      AWS_ACCESS_KEY_ID: process.env._AWS_ACCESS_KEY_ID,
      AWS_DEFAULT_REGION: process.env._AWS_DEFAULT_REGION,
      AWS_SECRET_ACCESS_KEY: process.env._AWS_SECRET_ACCESS_KEY
    };
    
    const keys = Object.keys(process.env).filter(key => key.startsWith(`_${deplyment}_ENV_`));
    
    keys.forEach(key => {     
      childEnv[key.substring(`_${deplyment}_ENV_`.length)] = process.env[key];
    });
    
    const s3bucket = process.env[`_${deplyment}_S3_BUCKET`];
    const cloudfrontDistributionId = process.env[`_${deplyment}_CLOUDFRONT_DISTRIBUTION_ID`];
    
    await execCommand("npm", [ "run", "build"], { env: childEnv });
    await execCommand("aws", [ "s3", "cp", "--recursive", "./build", `s3://${s3bucket}/`], { env: childEnv });
    await execCommand("aws", [ "cloudfront", "create-invalidation", "--distribution-id", cloudfrontDistributionId], { env: childEnv });
  } catch (e) {
    console.error(e);
  }
});