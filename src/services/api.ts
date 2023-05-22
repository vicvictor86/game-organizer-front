import axios from 'axios';

const backEndUrl = process.env.NODE_ENV === 'production' ? 'http://54.235.46.90:3333/' : 'http://localhost:3333/';

export const api = axios.create({
  baseURL: backEndUrl,
});
