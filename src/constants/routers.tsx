import * as pages from "../pages";
import * as layouts from "../layouts";
import React from "react";

export type IRouter = {
    name: string;
    path: string;
    component: React.ComponentType;
    layout: React.ComponentType<{ children: React.ReactNode }>;
};

export const publicRouters: IRouter[] = [
    {
        name: "AuthPage",
        path: "/",
        component: pages.AuthPage,
        layout: layouts.AuthLayout,
    },
    {
        name: "NotFound",
        path: "*",
        component: pages.NotFound,
        layout: layouts.MainLayout,
    },
];

export const authRouters: IRouter[] = [
    {
        name: "DashBoard",
        path: "/dashboard",
        component: pages.DashBoard,
        layout: layouts.MainLayout,
    },
    {
        name: "Products",
        path: "/products",
        component: pages.Product,
        layout: layouts.MainLayout,
    },
    {
        name: "ProductDetails",
        path: "/products/details",
        component: pages.ProductDetailsPage,
        layout: layouts.MainLayout,
    },
    {
        name: "ProductAdd",
        path: "/products/add",
        component: pages.ProductAdd,
        layout: layouts.MainLayout,
    },
    {
        name: "ProductSubCategory",
        path: "/products/subcategory",
        component: pages.ProductSubCategory,
        layout: layouts.MainLayout,
    },
    {
        name: "ProductDiscount",
        path: "/products/discount",
        component: pages.ProductDiscount,
        layout: layouts.MainLayout,
    },
    {
        name: "ProductRegions",
        path: "/products/regions",
        component: pages.ProductRegion,
        layout: layouts.MainLayout,
    },
    {
        name: "Orders",
        path: "/orders",
        component: pages.Orders,
        layout: layouts.MainLayout,
    },
    {
        name: "OrderDetails",
        path: "/orders/details",
        component: pages.OrderDetailsPage,
        layout: layouts.MainLayout,
    },
    {
        name: "Discount",
        path: "/discount",
        component: pages.Discount,
        layout: layouts.MainLayout,
    },
    {
        name: "Users",
        path: "/users",
        component: pages.Users,
        layout: layouts.MainLayout,
    },
    {
        name: "Setting",
        path: "/settings",
        component: pages.Setting,
        layout: layouts.MainLayout,
    },
];
