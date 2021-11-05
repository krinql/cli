import Conf from 'conf';
import { UserConfig } from './userData.types';
import jwtDecode from 'jwt-decode';

export const config = new Conf({projectName: 'krinql', projectSuffix: 'cli' });

export const updateUserTokens = (tokens: UserConfig['Account']): void => {
  const decodedToken:{email: string} = jwtDecode(tokens.accessToken);

  config.set('userConfig.Account', tokens);
  config.set('userConfig.Profile.email', decodedToken.email);
};
