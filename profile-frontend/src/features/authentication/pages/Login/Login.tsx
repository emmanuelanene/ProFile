import {FormEvent, useState} from "react";
import {useAuthenticationContext} from "../../contexts/AuthenticationContextProvider.tsx";
import usePageTitle from "../../../../hooks/usePageTitle.tsx";
import {Link, useNavigate} from "react-router-dom";
import classes from "./Login.module.scss";
import Box from "../../components/Box/Box.tsx";
import Input from "../../../../components/Input/Input.tsx";
import Button from "../../../../components/Button/Button.tsx";
import {useLocation} from "react-router-dom";
import Separator from "../../components/Separator/Separator.tsx";

function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthenticationContext();

    usePageTitle("Login");
    const navigate = useNavigate();
    const location = useLocation();


    const doLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;

        try {
            await login(email, password);
            const destination = location.state?.from || "/"
            navigate(destination);
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage("An Unexpected error occurred.");
            }
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
        <div className={classes.box}>
            <Box>
                <h1>Login</h1>
                <p>Stay updated on your professional world.</p>

                <form onSubmit={doLogin}>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        label="Email"
                        onFocus={() => setErrorMessage("")}
                    />

                    <Input
                        name="password"
                        id="password"
                        placeholder="Password"
                        label="Password"
                        type="password"
                    />

                    {
                        errorMessage && <p className={classes.error}>{errorMessage}</p>
                    }

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "..." : "Sign in"}
                    </Button>

                    <Link to="/authentication/request-password-reset">Forgot password?</Link>

                </form>


                <Separator>Or</Separator>


                <div className={classes.register}>
                    New to LinkedIn? <Link to="/authentication/signup" className={classes.link}>Join now</Link>
                </div>
            </Box>
        </div>
    )
}

export default Login
