import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery';

/** Server-state cache. Feature modules add endpoints with `apiSlice.injectEndpoints`. */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Url'],
  endpoints: () => ({}),
});
