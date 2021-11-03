export type BaseOptions = {
  query: string;
};

export const baseOptions = {
  query: { type: 'string'},
} as const;

export const API_BASE_PATH = 'https://krinql.com/api';
