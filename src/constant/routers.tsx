import * as pages from "../pages";
import * as layouts from "../layouts";
import React from "react";

type IRouter = {
    name: string;
    path: string;
    component: React.ComponentType;
    layout: React.ComponentType<{ children: React.ReactNode }>;
    auth: boolean;
};

export const routers: IRouter[] = [
    {
        name: "AuthPage",
        path: "/",
        component: pages.AuthPage,
        layout: layouts.AuthLayout,
        auth: false,
    },
    {
        name: "DashBoard",
        path: "/dashboard",
        component: pages.DashBoard,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "Products",
        path: "/products",
        component: pages.Product,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "ProductDetails",
        path: "/products/details",
        component: pages.ProductDetailsPage,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "Orders",
        path: "/orders",
        component: pages.Orders,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "OrderDetails",
        path: "/orders/details",
        component: pages.OrderDetailsPage,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "Discount",
        path: "/discount",
        component: pages.Discount,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "Users",
        path: "/users",
        component: pages.Users,
        layout: layouts.MainLayout,
        auth: true,
    },
    {
        name: "Setting",
        path: "/settings",
        component: pages.Setting,
        layout: layouts.MainLayout,
        auth: true,
    },
];
