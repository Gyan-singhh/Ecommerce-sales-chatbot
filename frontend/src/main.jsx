import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AuthLayout from "./auth/AuthLayout.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <AuthLayout allowPublic={true}>
            <HomePage />
          </AuthLayout>
        ),
      },
      {
        path: "/chat",
        element: (
          <AuthLayout allowPublic={false}>
            <ChatPage />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout allowPublic={true}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout allowPublic={true}>
            <RegisterPage />
          </AuthLayout>
        ),
      },
      {
        path: "/cart",
        element: (
          <AuthLayout allowPublic={false}>
            <CartPage />
          </AuthLayout>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
