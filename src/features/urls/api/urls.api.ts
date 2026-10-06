import { apiSlice } from "../../../api/apiSlice";
import type { ListUrlsArgs, Paginated, ShortUrl } from "../urls.types";

const LIST = { type: "Url" as const, id: "LIST" };

export const urlsApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    getUrls: b.query<Paginated<ShortUrl>, ListUrlsArgs>({
      query: (params) => ({ url: "/urls", params }),
      providesTags: (res) => [
        LIST,
        ...(res?.items ?? []).map((u) => ({ type: "Url" as const, id: u.id })),
      ],
    }),
    getUrl: b.query<ShortUrl, string>({
      query: (id) => ({ url: `/urls/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Url", id }],
    }),
    createUrl: b.mutation<ShortUrl, string>({
      query: (url) => ({ url: "/urls", method: "POST", data: { url } }),
      invalidatesTags: [LIST],
    }),
    deleteUrl: b.mutation<void, string>({
      query: (id) => ({ url: `/urls/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [LIST, { type: "Url", id }],
    }),
  }),
});

export const {
  useGetUrlsQuery,
  useGetUrlQuery,
  useCreateUrlMutation,
  useDeleteUrlMutation,
} = urlsApi;
