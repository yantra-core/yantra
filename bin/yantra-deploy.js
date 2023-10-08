import yantra from '@yantra-core/sdk';
import inquirer from 'inquirer';
import ProgressBar from 'cli-progress';
import fs from 'fs';
import min from 'minimist'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localWorldConfigPath = path.resolve(process.cwd() + '/config.js');

const tokenPath = path.resolve(__dirname + '/../config/token.json');

let argv = min(process.argv.slice(2));
var deployPath = argv._[0] || process.cwd();
const excludes = ['.DS_Store', 'node_modules', 'package-lock.json'];

// Load owner from token.json
if (!fs.existsSync(tokenPath)) {
    console.log('You are not currently logged in.');
    console.log('Run `yantra login` to login to Yantra.');
    process.exit(1);  // exit the process with an error status
}

const tokenContent = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
const owner = tokenContent.account;

let client = yantra.createClient({
    owner: owner // TODO: token: tokenContent.token,
});

async function go() {
    // Prompt the user for the deploy path
    const answers = await inquirer.prompt([{
        type: 'input',
        name: 'deployPath',
        message: 'Enter the directory path to deploy:',
        default: process.cwd(),
        prefix: ''
    }]);

    const deployPath = answers.deployPath;

    // Display deploy path
    console.log('Preparing to deploy from path:', deployPath);

    // Load the worldName from the package.json in the deployPath
    const packageJsonPath = path.join(deployPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.error('Error: package.json not found in the deploy directory.');
        return;
    }

    const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const worldName = packageJsonContent.name;

    const localWorldConfig = await getLocalWorldConfig();
    if (!localWorldConfig) {
        console.error("Cannot proceed without local world configuration.");
        process.exit(1);
    } else {
        console.log("Using local world configuration:", localWorldConfig);
    }


    /*
    // Load the game config from the config.js file in the deployPath
    const configPath = path.join(deployPath, 'config.js');
    if (!fs.existsSync(configPath)) {
        console.error('Error: config.js not found in the deploy directory.');
        return;
    }
    */

    // Continue with your existing deployment logic
    let outputFilePath = `${worldName}.zip`;
    await client.zip(deployPath, outputFilePath, excludes);
    console.log('outputFilePath', outputFilePath);
    const fileSize = (fs.statSync(outputFilePath).size / (1024 * 1024)).toFixed(2);
    const fileSizeKB = fs.statSync(outputFilePath).size / 1024;  // Size in KB
    if (fileSizeKB > 9000) {
        throw new Error(outputFilePath + " file size exceeds the allowed limit of 9000 KB. Will not deploy.");
    }
    console.log(`Zipped file size: ${fileSize} MB`);

    console.log('about to use', owner, worldName);
    // create empty world if doesn't exist
    try {
        await client.createWorld(owner, worldName, localWorldConfig);
    } catch (err) {
        console.log(err);
    }

    // since we are doing a new deploy, we *must* ensure the production config matches local
    // certain world config options are *required* at start-time for Etherspace to allocate a server
    // we do strive to make the majority of config options available at run-time
    // await client.updateWorld(owner, worldName, localConfig);

    await client.deploy(owner, worldName, deployPath);
}

go();

async function getLocalWorldConfig() {
    try {
        const worldConfigModule = await import(localWorldConfigPath);
        return worldConfigModule.default || worldConfigModule;
    } catch (error) {
        console.error("Failed to load local world configuration:", error.message);
        return null;
    }
}
