import chalk from 'chalk';
import figlet from 'figlet';

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

export const deviceConfigured = async (configPath: string): Promise<never> => {
  process.stdout.write(`
✨ Configuration written to ${chalk.cyan(configPath)}.

Let's try asking a question!

    ${chalk.bold('$ krinql email regex javascript')}

`);

  process.exit(0);
};
