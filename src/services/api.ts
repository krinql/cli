import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_BASE_PATH } from '../shared';
import { config } from './config/userData';
import handleError from '../handleError';

export const api = async (path: string, data: any): Promise<string[]> => {
  const accessToken = config.get('userConfig.Account.accessToken');

  return axios.post(`${API_BASE_PATH}/${path}`, data ? JSON.stringify(data) : undefined, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response: AxiosResponse) => response.data.data).catch((err: AxiosError) => handleError(err.response?.data.message, err));
}
