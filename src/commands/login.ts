import ora from 'ora';
import * as outputs from './login.outputs';
import { Builder, Handler } from './login.types';


export const command = 'login';
export const desc = 'Login with a new or existing account';

export const builder: Builder = (yargs) =>
  yargs
    .options({
      reauth: {
        type: 'boolean',
        desc: 're-authenticate using Krinql',
        alias: 'reauth'
      }
    })
    .example([
      ['$0 login'],
      ['$0 login --reauth'],
    ]);

export const handler: Handler = async (argv) => {
  const spinner = ora()

  const { reauth } = argv;

  outputs.welcome();


  spinner.start('Logging in');
  // await api.login
  spinner.succeed();




    spinner.start('Fetching existing account configuration');


    spinner.succeed();


    // const configPath = await writeUserConfig({
    // });

    // outputs.deviceConfigured(configPath);


};
