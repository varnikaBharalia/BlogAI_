import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import {Toaster} from "react-hot-toast";

import LoginForm from "./component/Login/LoginForm";
import Home from "./component/Home/Home";
import About from "./component/About/About";
import Contact from "./component/Contact/Contact";
import Layout from "../Layout/Layout";
import { UserProvider } from "./component/UserContext/UserContext";
import AddBlog from "./component/AddBlog/AddBlog";
import Blog from "./component/Blog/Blog";
import NotFound from "./component/NotFound/NotFound";
import LandingPage from "./component/LandingPage/landing";

const router = createBrowserRouter([
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path:"",
        element:<Home/>
      },
      {
        path:"about",
        element:<About/>
      },
      {
        path:"contact",
        element:<Contact/>
      },
      {
        path:"addBlog",
        element:<AddBlog/>
      },
      {
        path: "blog/:id",
        element: <Blog/>,
      },
      {
        path: "*",
        element: <NotFound />
      },
    ]
  },
  {
    path: "/signup",
    element: <LoginForm />,
  },
  {
    path: "/signin",
    element: <LoginForm />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider value={{ CurrentUser: null, AllBlogs: [] }}>
      <Toaster position="top-right"  />
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
