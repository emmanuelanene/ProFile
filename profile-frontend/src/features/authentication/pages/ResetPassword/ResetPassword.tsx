// import React from 'react'

import {FormEvent, useState} from "react";
import usePageTitle from "../../../../hooks/usePageTitle.tsx";
import {useNavigate} from "react-router-dom";
import {request} from "../../../../utils/api.ts";
import classes from "./ResetPassword.module.scss"
import Box from "../../components/Box/Box.tsx"
import Input from "../../../../components/Input/Input.tsx";
import Button from "../../../../components/Button/Button.tsx";

function ResetPassword() {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    usePageTitle("Reset Password");

    const sendPasswordResetToken = async (email: string) => {
        await request<void>({
            endpoint: `/api/v1/authentication/send-password-reset-token?email=${email}`,
            method: "PUT",

            onSuccess: () => {
                setErrorMessage("");
                setEmailSent(true);
            },

            onFailure: (error) => {
                setErrorMessage(error);
            }
        });

        setIsLoading(false);
    };


    const resetPassword = async (email: string, code: string, password: string) => {
        await request<void>({
            endpoint: `api/v1/authentication/reset-password?email=${email}&token=${code}&newPassword=${password}`,
            method: "PUT",

            onSuccess: () => {
                setErrorMessage("");
                navigate("/login")
            },

            onFailure: (error) => {
                setErrorMessage(error);
            }
        });

        setIsLoading(false);
    }

    return (
        <div className={classes.root}>
            <Box>
                <h1>Reset Password</h1>

                {!emailSent ?
                    (
                        <form
                            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                setIsLoading(true);

                                const email = e.currentTarget.email.value;
                                await sendPasswordResetToken(email);

                                setEmail(email);
                                setIsLoading(false);
                            }}
                        >
                            <p>
                                Enter your email and we’ll send a verification code if it matches an existing LinkedIn
                                account.
                            </p>

                            <Input
                                name="email"
                                id="email"
                                placeholder="Email"
                                label="Email"
                                type="email"
                            />

                            <p style={{color: "red"}}>{errorMessage}</p>

                            <Button type="submit" disabled={isLoading}>
                                Next
                            </Button>

                            <Button
                                outline
                                onClick={() => {
                                    navigate("/authentication/login");
                                }}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        </form>
                    ) :

                    (
                        <form
                            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                setIsLoading(true)

                                const code = e.currentTarget.code.value;
                                const password = e.currentTarget.password.value;

                                await resetPassword(email, code, password);

                                setIsLoading(false);
                            }}
                        >
                            <p>Enter the verification code we sent to your email and your new password.</p>

                            <Input
                                name="code"
                                id="code"
                                key="code"
                                placeholder="Code"
                                label="Verification code"
                                type="text"
                            />

                            <Input
                                name="password"
                                id="password"
                                placeholder="Password"
                                label="Password"
                                type="password"
                            />

                            <p style={{color: "red"}}>{errorMessage}</p>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "..." : "Reset Password"}
                            </Button>

                            <Button
                                outline
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                    setEmailSent(false);
                                    setErrorMessage("");
                                }}
                            >
                                {isLoading ? "..." : "Back"}
                            </Button>
                        </form>
                    )
                }
            </Box>

        </div>

    )
}

export default ResetPassword
