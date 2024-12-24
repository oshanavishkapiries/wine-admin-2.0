import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "@/features/config.ts";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

export const imageUploadApi = createApi({
  reducerPath: "imageUploadApi",
  baseQuery,
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data) => ({
        url: "/images/upload-image",
        method: "POST",
        body: data,
      }),
    }),
    updateImage: builder.mutation({
      query: (data) => ({
        url: "/images/update-image",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation, useUpdateImageMutation } =
  imageUploadApi;
