import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function init() {

  const sourceDir = path.resolve(__dirname, '../examples/world');
  const destDir = process.cwd();

  try {
    await copyWithOverwritePrompt(sourceDir, destDir)
    console.log('New world initialized successfully!');
    console.log('Run `npm start` or `node boot.js` to start your world.')
    console.log('Run `yantra deploy` to deploy your world to Yantra.')
  
  } catch (err) {
    console.log(err.message)
    // throw err;
  }
}

// Execute the init function
init();

async function shouldOverwrite(file) {
  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: `File ${file} already exists. What would you like to do?`,
    choices: [
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Always Overwrite (for all files)', value: 'always' },
      { name: 'Cancel', value: 'cancel' },
    ],
  }]);

  return action;
}

async function copyWithOverwritePrompt(sourceDir, destDir) {
  let alwaysOverwrite = false;

  // Wrap fs.readdir in a Promise
  const files = await new Promise((resolve, reject) => {
    fs.readdir(sourceDir, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });

  for (let file of files) {
    const sourceFilePath = path.join(sourceDir, file);
    const destFilePath = path.join(destDir, file);

    if (fs.existsSync(destFilePath) && !alwaysOverwrite) {
      const action = await shouldOverwrite(file);

      if (action === 'cancel') {
        throw new Error('Initialization cancelled.')
        return;
      } else if (action === 'always') {
        alwaysOverwrite = true;
      } else if (action !== 'overwrite') {
        continue;
      }
    }

    fs.copyFileSync(sourceFilePath, destFilePath);
  }

  console.log('Files copied successfully!');
}
