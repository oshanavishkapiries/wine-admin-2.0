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
    name: "DashBoard",
    path: "/",
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
];
