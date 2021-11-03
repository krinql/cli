import ora from 'ora';
import open from 'open';
import axios from 'axios';
import cors from 'cors';
import { AddressInfo } from 'net'
import express from 'express';
import * as outputs from './login.outputs';
import { Builder, Handler } from './login.types';
import { ParsedQs } from 'qs';


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
  const app = express();
  const corsOptions = {
    origin: '*'
  }

  app.use(cors(corsOptions));

  let resolve: { (arg0: string | ParsedQs | string[] | ParsedQs[] | undefined): void; (value: unknown): void; };
  const p = new Promise((_resolve) => {
    resolve = _resolve;
  });
  app.get('/auth', (req, res) => {
    resolve(req.query);
    console.log(`\nAccess token - ${req.query.token}\n refresh - ${req.query.refreshToken}`)
    res.end('');
  });

  const server = await app.listen(0);
  const { port } = server.address() as AddressInfo;

  // open(`https://krinql.com/auth/external/cli/login?redirect_uri=http://localhost:${port}/auth`);
  open(`http://localhost:3000/auth/external/cli/login?redirect_uri=http://localhost:${port}/auth`); // dev

  // Wait for token
  await p;

  await server.close();

  spinner.succeed();


  spinner.start('Fetching existing account configuration');


  spinner.succeed();


  // const configPath = await writeUserConfig({
  // });

  // outputs.deviceConfigured(configPath);
  process.exit(0);

};
