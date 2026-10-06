import axios from 'axios';
import { env } from '../config/env';
import { registerInterceptors } from './interceptors';

export const http = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // send/receive the HttpOnly session cookies cross-origin
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

registerInterceptors(http);
