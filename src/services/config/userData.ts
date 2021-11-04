import Conf from 'conf';
import { UserConfig } from '.';

export const config = new Conf();

export const updateUserConfig = (data: UserConfig['Account']): void => {
    config.set('accessToken', data.accessToken);
    config.set('refreshToken', data.refreshToken);
    config.set('name', data.name);
}

