import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../config";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("Bearer") || "";

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json");
        }
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery,
    reducerPath: "api",
    tagTypes: ["Products", "Images", "Orders"],
    endpoints: () => ({}),
});
