import ora from 'ora';
import * as outputs from './askKrinql.outputs';
import { api } from '../../services/api';
import { Handler } from './askKrinql.types';
import { parseSentence } from '../helpers';

export const askKrinqlhandler: Handler = async (argv) => {
  const spinner = ora();

  // make sentence
  const inputQuestion = parseSentence(argv._.slice(1));

  // todo: verify empty args

  spinner.start('Fetching Results');

  const ans = await api("openai", {
    params: { inputQuestion },
    template: "factualAnswering",
  });

  spinner.succeed();

  outputs.showAns(ans);

  process.exit(0);
};
