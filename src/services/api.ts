
import axios from 'axios';
import { API_BASE_PATH } from '../shared';

const api = axios.create({ baseURL: API_BASE_PATH });

export default api;
