export type BaseOptions = {
  query: string;
};

export const IS_DEV = false;

export const API_BASE_PATH = IS_DEV?'http://localhost:3000/api':'https://krinql.com/api';
export const AUTH_BASE_PATH = IS_DEV?'http://localhost:3000/auth/external/cli/login':'https://krinql.com/auth/external/cli/login';
export const FIREBASE_API_KEY = "AIzaSyCDkSplsCexKg1Pn_4LtXqKiSNafXAs4zE";

