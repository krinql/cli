import ora from 'ora';
import * as outputs from './askKrinql.outputs';
import { api } from '../../services/api';
import { Builder, Handler } from './askKrinql.types';
import { parseSentence } from '../../utils/helpers';
export const command = 'ask';
export const desc = 'Let Krinql answer questions and doubts';

export const builder: Builder = (yargs) =>
  yargs

export const handler: Handler = async (argv) => {
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
