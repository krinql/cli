#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import handleError from './handleError';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  // Default command if none supplied - shows help.
  .command(
    '$0',
    'The Krinql CLI usage',
    () => undefined,
    () => {
      yargs.showHelp();
    },
  )
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' })
  // Be nice.
  .epilogue('For more information, checkout https://krinql.com')
  // Handle failures.
  .fail(handleError).argv;
