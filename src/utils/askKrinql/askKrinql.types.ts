import type { Arguments, CommandBuilder } from 'yargs';

import type { BaseOptions } from '../../shared';

export type Options = BaseOptions;

export type Builder = CommandBuilder<Options, Options>;

export type Handler = (argv: Arguments) => PromiseLike<void>;
