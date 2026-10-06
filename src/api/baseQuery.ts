import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig } from 'axios';
import { http } from './axios';
import { ApiError, toApiError } from './errors';

export interface AxiosQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: unknown;
}

export const axiosBaseQuery = (): BaseQueryFn<AxiosQueryArgs, unknown, ApiError> => async (args) => {
  try {
    const res = await http.request({ url: args.url, method: args.method ?? 'GET', data: args.data, params: args.params });
    return { data: res.data };
  } catch (e) {
    return { error: toApiError(e) };
  }
};
