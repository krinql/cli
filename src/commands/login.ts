import ora from 'ora';
import open from 'open';
import axios from 'axios';
import cors from 'cors';
import { AddressInfo } from 'net'
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as outputs from './login.outputs';
import { Builder, Handler } from './login.types';
import { updateUserConfig, config } from '../services/config/userData';
import { AUTH_BASE_PATH } from '../shared';
import url from 'url';
import { ParsedUrlQuery } from 'querystring';

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

  let resolve: { (arg0: ParsedUrlQuery): void; (value: unknown): void; };
  const p = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // add domain in production
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const url = new URL(req.url ?? '', `http://${req.headers.host}/`);

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end('');
    } else if (url.pathname === '/auth' && req.method === 'GET') {
      resolve(url.search);
      updateUserConfig({ "accessToken": url.searchParams.get('accessToken')?.toString() ?? '', "refreshToken": url.searchParams.get('refreshToken')?.toString() ?? '', "name": url.searchParams.get('name')?.toString() ?? '' });
      res.end('');
    }
  });

  server.listen(0);
  const { port } = server.address() as AddressInfo;
  if (process.env.NODE_ENV == 'production')
    open(`${AUTH_BASE_PATH}?redirect_uri=http://localhost:${port}/auth`);
  else
    open(`http://localhost:3000/auth/external/cli/login?redirect_uri=http://localhost:${port}/auth`); // dev

  // Wait for token
  await p;

  await server.close();

  spinner.succeed();

  spinner.start('Fetching existing account configuration');
  spinner.succeed();

  // display details 
  outputs.showUserConfig();
  outputs.deviceConfigured(config.path);

  process.exit(0);

};
