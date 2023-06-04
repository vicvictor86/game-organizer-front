import axios from 'axios';

const backEndUrl = process.env.NODE_ENV === 'production' ? process.env.BACK_END_URL : 'http://localhost:3333/';

export const api = axios.create({
  baseURL: backEndUrl,
});
