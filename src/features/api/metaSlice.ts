import { apiSlice } from "./apiSlice";

export const metaSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMeta: builder.query({
      query: () => ({
        url: "meta-data/all",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMetaQuery } = metaSlice;
