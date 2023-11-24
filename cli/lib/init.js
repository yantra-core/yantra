import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = {};

init.configureWorld = async function configureWorld(sourceDir, defaultWorldName) {
  inquirer.prompt.prefix = '';

  // Prompt for project details
  const responses = await inquirer.prompt([{
    type: 'input',
    name: 'worldName',
    message: 'world name:',
    default: defaultWorldName,
    prefix: '',
  }, {
    type: 'input',
    name: 'version',
    message: 'version:',
    default: '1.0.0',
    prefix: ''
  }, {
    type: 'input',
    name: 'description',
    message: 'description:',
    default: '',
    prefix: ''
  }]);

  const destDir = process.cwd();
  await copyWithOverwritePrompt(sourceDir, destDir);

  // Update package.json with user input after copying files
  const packageJsonPath = path.join(destDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = responses.worldName;
  packageJson.version = responses.version;
  packageJson.description = responses.description;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  /*
  // TODO: add back world config.js files
  // Updates the config.js file with world name
  const configJsPath = path.join(destDir, 'config.js');
  if (fs.existsSync(configJsPath)) {
    let configJsContent = fs.readFileSync(configJsPath, 'utf-8');
    configJsContent = configJsContent.replace(/my-world/g, responses.worldName);
    fs.writeFileSync(configJsPath, configJsContent, 'utf-8');
    console.log('Updated config.js with world name: ' + responses.worldName);
  }
  */

  console.log(responses.worldName, 'initialized successfully!');
  console.log('');
  console.log('Run `npm install` to install dependencies.');
  console.log('Run `npm start` to start your world.')
  console.log('Run `yantra deploy` to deploy your world to Yantra.');
  console.log('');
  console.log('You *must* run `npm install` in the specific directory before running `npm start`.');

}

init.scaffold = async function scaffoldInit() {

  const sourceDir = path.resolve(__dirname, '../node_modules/@yantra-core/starter-blueprint');

  const defaultWorldName = path.basename(process.cwd());

  await init.configureWorld(sourceDir, defaultWorldName);

}

init.clone = async function cloneInit(worldname) {

  const library = ['pong', 'snake'];

  if (typeof worldname === 'undefined') {
    console.error('You must specify a world to clone.');
    console.log('Available worlds:\n' + library.join('\n'));
    return;
  }

  if (!library.includes(worldname)) {
    console.error(`The world '${worldname}' does not exist in the library.`);
    console.log('Available worlds:', library.join(', '));
    return;
  }

  const sourceDir = path.resolve(__dirname, '../node_modules/@yantra-core/examples', worldname);
  await init.configureWorld(sourceDir, worldname);
}

async function shouldOverwrite(file, path) {
  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: `File ${path} already exists. What would you like to do?`,
    choices: [
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Always Overwrite (for all files)', value: 'always' },
      { name: 'Ignore', value: 'ignore' },
      { name: 'Cancel', value: 'cancel' },
    ],
  }]);

  return action;
}

// TODO: use defaults from existing local .gitignore file, merge with excludes
const excludes = ['.DS_Store', 'node_modules', 'package-lock.json', '.git'];

async function copyWithOverwritePrompt(sourceDir, destDir) {
  let alwaysOverwrite = false;

  async function recursiveCopy(src, dest) {
    const entries = fs.readdirSync(src);

    for (let entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);

      // Check if the entry is in the excludes list
      if (excludes.includes(entry)) {
        continue;
      }

      if (fs.statSync(srcPath).isDirectory()) {
        // If directory doesn't exist, create it
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath);
        }

        // Recursively copy the directory
        await recursiveCopy(srcPath, destPath);
      } else {
        if (fs.existsSync(destPath) && !alwaysOverwrite) {
          const action = await shouldOverwrite(entry, destPath);

          if (action === 'cancel') {
            throw new Error('Initialization cancelled.');
            return;
          } else if (action === 'always') {
            alwaysOverwrite = true;
          } else if (action !== 'overwrite') {
            continue;
          }
        }

        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  await recursiveCopy(sourceDir, destDir);
  console.log(`World copied into ${destDir}`);

  // Remark: Show sourceDir since destDir might not have been empty originally,
  //         and we only want to display the files that were copied
  displayDirectoryTree(sourceDir);
}

function displayDirectoryTree(basePath, level = 0, depth = 1) {
  const entries = fs.readdirSync(basePath);

  if (level >= depth) {
    return;
  }

  for (const entryName of entries) {
    const entryPath = path.join(basePath, entryName);

    // Skip over any items that match the excludes list
    if (excludes.includes(entryName)) {
      continue;
    }

    // For indentation based on directory level
    const prefix = '  '.repeat(level);

    console.log(`${prefix}${entryName}`);

    // If the entry is a directory, recursively print its contents
    if (fs.statSync(entryPath).isDirectory()) {
      displayDirectoryTree(entryPath, level + 1);
    }
  }
}



export default init;