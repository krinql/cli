import chalk from 'chalk';

export const showAns = (result: string[]): Promise<never> => {
  process.stdout.write(`
Output: ${chalk.cyan(result[0])} 
`);

  process.exit(0);
};
