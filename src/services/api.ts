import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { API_BASE_PATH, FIREBASE_API_KEY } from '../shared';
import { clearUserTokens, updateUserTokens, config as userConfig } from './config/userData';
import handleError from '../handleError';
 
export const httpHandler = axios.create({
  baseURL: API_BASE_PATH,
  timeout: 25000,
});


httpHandler.interceptors.request.use(
  async (config) => {
    const accessToken = userConfig.get('userConfig.Account.accessToken');
    if(!accessToken){
      const customError =  new Error('Please Sign in');
      customError.name = "auth/no-token";
      throw customError;
    };

    // @ts-expect-error - Typings are wonky for this package at the moment.
    config.headers = config.baseURL!=="https://securetoken.googleapis.com/v1" ? { 
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Authorization': `Bearer ${accessToken}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json'
    }:{
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},

    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  });

httpHandler.interceptors.response.use((response) => {
  return response;
  }, async function (error) {
  const originalRequest = error.config;
  if (error?.response?.status === 401 && originalRequest.baseURL!=="https://securetoken.googleapis.com/v1") {
    const token = await refreshAuthToken();            
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return httpHandler(originalRequest);
  }
  return Promise.reject(error);
  });

// refresh token update
const refreshAuthToken = async () => {
  const options: AxiosRequestConfig = {
    method: 'POST',
    baseURL:'https://securetoken.googleapis.com/v1',
    url: 'token',
    params: {key: FIREBASE_API_KEY},
    data: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      grant_type: 'refresh_token',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      refresh_token: userConfig.get('userConfig.Account.refreshToken')
    }
  };
    try{
    const response = await httpHandler.request(options);
    if(response.status === 200) {
      const accessToken = response.data.id_token;
      const refreshToken = response.data.refresh_token;
      updateUserTokens({accessToken, refreshToken});
    } else {
    console.warn("Authentication Failure");
    clearUserTokens();
    }
  }catch(err){
    console.warn("Authentication Failure");
    clearUserTokens();
  }
};


export const api = async (path: string, data: any): Promise<string[]> => {

  return httpHandler.post(`${path}`, data ? JSON.stringify(data) : undefined)
    .then((response: AxiosResponse) => response.data.data).catch((err: AxiosError) =>handleError(err.response?.data?.message,err));
}
