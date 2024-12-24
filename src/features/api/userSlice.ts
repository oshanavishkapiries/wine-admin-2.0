import {apiSlice} from "./apiSlice";

export const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUser: builder.query({
            query: (data) => ({
                url: `/users?page=${data.page}&limit=${data.limit}`,
                method: "GET",
            }),
        }),
    }),
});

export const {useGetAllUserQuery} = orderSlice;
