import ora from 'ora';
import open from 'open';
import { AddressInfo } from 'net';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as outputs from './login.outputs';
import { Builder, Handler } from './login.types';
import { updateUserTokens, config } from '../services/config/userData';
import { AUTH_BASE_PATH, IS_DEV } from '../shared';
import { ParsedUrlQuery } from 'querystring';
import chalk from 'chalk';
import handleError from '../handleError';

export const command = 'login';
export const desc = 'Login with a new or existing account';

export const builder: Builder = (yargs) =>
  yargs
    .options({
      reauth: {
        type: 'boolean',
        desc: 're-authenticate using Krinql',
        alias: 'reauth',
      },
    })
    .example([['$0 login'], ['$0 login --reauth']]);

export const handler: Handler = async (argv) => {
  const spinner = ora();

  const { reauth } = argv;

  outputs.welcome();

  if (!reauth && config.has('userConfig.Account')) {
    outputs.userConfigFound();
    process.exit(0);
  }

  spinner.start('Logging in');

  let resolve: { (arg0: ParsedUrlQuery): void; (value: unknown): void };
  const p = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (IS_DEV) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Request-Method', '*');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'https://krinql.com');
      res.setHeader('Access-Control-Request-Method', 'GET');
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    }

    const url = new URL(req.url ?? '', `http://${req.headers.host}/`);

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end('');
    }
    if (url.pathname === '/auth' && req.method === 'GET') {
      // Obtain the access token and refresh token from the query string
      const accessToken = url.searchParams.get('accessToken');
      const refreshToken = url.searchParams.get('refreshToken');

      // Validate and process
      if (accessToken && refreshToken) {
        updateUserTokens({
          accessToken,
          refreshToken,
        });
        res.end('');
      } else {
        spinner.fail('Failed to log in, did not receive tokens');
      }

      resolve(url);
    }
  });

  server.listen(0);
  const { port } = server.address() as AddressInfo;
  const openURL = `${AUTH_BASE_PATH}?redirect_port=${port}`;
  try {
    process.stdout.write(`
  Opening webpage in default browser to login
  Please open the following URL if it doesn't open automatically: 
  ${chalk.bold(openURL)} 
  `);
  open(openURL);

  } catch (e) {
    handleError(
      'Unable to open the browser automatically, please open the URL manually.',
      new Error("Unable to open browser automatically"),
    );
  }
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
