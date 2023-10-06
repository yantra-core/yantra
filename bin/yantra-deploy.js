import yantra from '@yantra-core/sdk';
import inquirer from 'inquirer';
import ProgressBar from 'cli-progress';
import fs from 'fs';

let client = yantra.createClient({});

import min from 'minimist'
let argv = min(process.argv.slice(2));
var deployPath = argv._[0] || process.cwd();
const excludes = ['.DS_Store', 'node_modules', 'package-lock.json'];


async function go() {
  // Prompt the user for the deploy path
  const answers = await inquirer.prompt([{
      type: 'input',
      name: 'deployPath',
      message: 'Enter the directory path to deploy:',
      default: process.cwd()
  }]);

  const deployPath = answers.deployPath;

  // Display deploy path
  console.log('Preparing to deploy from path:', deployPath);
  let outputFilePath = `${deployPath.split('/').pop()}.zip`;
  await client.zip(deployPath, outputFilePath, excludes);
  console.log('outputFilePath', outputFilePath)
  const fileSize = (fs.statSync(outputFilePath).size / (1024 * 1024)).toFixed(2);
  const fileSizeKB = fs.statSync(outputFilePath).size / 1024;  // Size in KB
  if (fileSizeKB > 9000) {
      throw new Error(outputFilePath, "file size exceeds the allowed limit of 9000 KB. Will not deploy.");
  }

  console.log(`Zipped file size: ${fileSize} MB`);
  // get the name of the current working directory
  let worldName = deployPath.split('/').pop();

  // create empty world if doesn't exist
  try {
      await client.createWorld(worldName);
  } catch (err) {
      console.log(err);
  }


  await client.deploy(worldName, deployPath);
}


go();



