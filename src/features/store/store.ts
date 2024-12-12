import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { imageUploadApi } from "../api/imageUploadSlice";
//import { authSlice } from "../api/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [imageUploadApi.reducerPath]: imageUploadApi.reducer,
    //[authSlice.name]: authSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(imageUploadApi.middleware),
  devTools: true,
});
