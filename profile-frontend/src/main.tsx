import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";

import AuthenticationContextProvider from "./features/authentication/contexts/AuthenticationContextProvider.tsx";
import AuthenticationLayout from "./features/authentication/components/AuthenticationLayout/AuthenticationLayout.tsx";


import Login from "./features/authentication/pages/Login/Login.tsx";
import Signup from "./features/authentication/pages/Signup/Signup.tsx";
import ResetPassword from "./features/authentication/pages/ResetPassword/ResetPassword.tsx";
import Profile from "./features/authentication/pages/Profile/Profile.tsx";
import VerifyEmail from "./features/authentication/pages/VerifyEmail/VerifyEmail.tsx";
import"./main.scss"



const router = createBrowserRouter([
    {
        element: <AuthenticationContextProvider />,
        children: [
            {
                path: "/authentication",
                element: <AuthenticationLayout />,
                children: [
                    {
                        path: "signup",
                        element: <Signup />,
                    },

                    {
                        path: "login",
                        element: <Login />,
                    },

                    {
                        path: "request-password-reset",
                        element: <ResetPassword />
                    },

                    {
                        path: "profile/:id",
                        element: <Profile />,
                    },

                    {
                        path: "verify-email",
                        element: <VerifyEmail />,
                    },
                ]
            }
        ]

    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
