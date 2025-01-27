import {FormEvent, useState} from "react";
import {useAuthenticationContext} from "../../contexts/AuthenticationContextProvider.tsx";
import usePageTitle from "../../../../hooks/usePageTitle.tsx";
import {Link, useNavigate} from "react-router-dom";
import Box from "../../components/Box/Box.tsx";
import Input from "../../../../components/Input/Input.tsx";
import classes from "./Signup.module.scss";
import Button from "../../../../components/Button/Button.tsx";
import Separator from "../../components/Separator/Separator.tsx";


function Signup() {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { signup } = useAuthenticationContext();
    const navigate = useNavigate();

    usePageTitle("Signup");


    const doSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const email = e.currentTarget.email.value;
        const password = e.currentTarget.value.password.value;

        try {
            await signup(email, password);
            navigate("/");
        }

        catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage("An Unknown Error Has Occured");
            }
        }

        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={classes.box}>
            <Box>
                <h1>Sign Up</h1>
                <p>Make the most of your professional life.</p>

                <form onSubmit={doSignUp}>
                    <Input
                        name="email"
                        placeholder="Email"
                        type="email"
                        id="email"
                        label="Email"
                        onFocus={() => setErrorMessage("")}
                    />

                    <Input
                        name="password"
                        placeholder="Password"
                        type="password"
                        id="password"
                        label="Password"
                        onFocus={() => setErrorMessage("")}
                    />

                    {
                        errorMessage && <p className={classes.error}>{errorMessage}</p>
                    }

                    <p>
                        By clicking Agree & Join or Continue, you agree to LinkedIn's{" "}
                        <a href="">User Agreement</a>, <a href="">Privacy Policy</a>, and{" "}
                        <a href="">Cookie Policy</a>.
                    </p>

                    <Button type="submit" disabled={isLoading}>
                        Agree & Join
                    </Button>
                </form>

                <Separator>Or</Separator>

                <div className={classes.register}>
                    Already on LinkedIn? <Link to={`/authentication/login`}>Sign in</Link>
                </div>
            </Box>
        </div>
    )
}

export default Signup
