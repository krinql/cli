import type { Arguments, CommandBuilder } from 'yargs';

import type { BaseOptions } from '../../shared';

export type Options = BaseOptions & {
  reauth: boolean | undefined;
};

export type Builder = CommandBuilder<Options, Options>;

export type Handler = (argv: Arguments<Options>) => PromiseLike<void>;
