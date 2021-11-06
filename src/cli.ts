#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import handleError from './handleError';
import { askKrinqlhandler } from './utils/askKrinql/askKrinql';

yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  // Default command if none supplied - shows help.
  .command(
    '$0',
    'The Krinql CLI usage',
    (yargs) => yargs.usage('$0 <question>').example([['$0 how to compile typescript code'], ['$0 how to implement decorators in python'], ['$0 how to softlink file in linux']]),
    async (argv) => {
      if (!argv._.slice(1).length)
        return yargs.showHelp();
      await askKrinqlhandler(argv);
    },
  )
  // Useful aliases.
  .alias({ h: 'help' })
  // Be nice.
  .epilogue('For more information, checkout https://krinql.com')
  // Handle failures.
  .fail(handleError).argv;
