import axios from 'axios';

const backEndUrl = process.env.NODE_ENV === 'production' ? 'https://game-organizer.up.railway.app/' : 'http://localhost:3333/';

export const api = axios.create({
  baseURL: backEndUrl,
});
