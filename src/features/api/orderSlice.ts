import {apiSlice} from "./apiSlice";

export const orderSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        orderStatus: builder.mutation({
            query: (data) => ({
                url: `orders/orders/${data.orderId}/status`,
                method: "PUT",
                body: data.data,
            }),
        }),
        getAllOrders: builder.query({
            query: ({page, limit}) => ({
                url: `/orders/orders?page=${page}&limit=${limit}`,
                method: "GET",
            }),
        }),
        updateOrder: builder.mutation({
            query: (data) => ({
                url: `orders/${data.orderId}`,
                method: "PUT",
                body: data.updates,
            }),
        }),
    }),
});

export const {
    useOrderStatusMutation,
    useGetAllOrdersQuery,
    useUpdateOrderMutation,
} = orderSlice;
