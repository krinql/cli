export type UserConfig = {
  Profile: {
    email: string | null;
  }
  Account: {
    accessToken: string;
    refreshToken: string;
  };
};