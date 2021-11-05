import chalk from 'chalk';
import figlet from 'figlet';
import { config } from '../services/config/userData';

export const welcome = (): void => {
  const welcomeAsciiText = figlet.textSync('Krinql')

  process.stdout.write(`
${welcomeAsciiText}

Welcome to Krinql.
Access krinql features without leaving your terminal or IDE.

`);
};

export const userConfigFound = (profile: string): Promise<never> => {
  process.stdout.write(`
The profile ${chalk.cyan(profile)} is already configured! 👌

If you would like to login using a new profile, run the following:

    ${chalk.bold(
    `$ krinql login --reauth`,
  )}

`);

  process.exit(0);
};

export const showUserConfig = (): void => {
  process.stdout.write(`
  Logged In as ${chalk.green(config.get('userConfig.Profile.email'))}
  `);
};

export const deviceConfigured = async (_configPath: string): Promise<never> => {
  process.stdout.write(`
✨ Configuration written to disk.

Let's try asking a question!

    ${chalk.bold('$ krinql email regex javascript')}

`);

  process.exit(0);
};
