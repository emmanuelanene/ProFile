// import React from 'react'

import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {IUser, useAuthenticationContext} from "../../contexts/AuthenticationContextProvider.tsx";
import { request } from "../../../../utils/api.ts";
import classes from "./Profile.module.scss";
import Box from "../../components/Box/Box.tsx";
import Input from "../../../../components/Input/Input.tsx";
import Button from "../../../../components/Button/Button.tsx";

function Profile() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const {user, setUser} = useAuthenticationContext();
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        position: "",
        location: ""
    });

    const onSubmit = async () => {
        if (!data.firstName || !data.lastName) {
            setErrorMessage("Please fill in your first and last name")
            return;
        }

        if (!data.company || !data.position) {
            setErrorMessage("Please fill in your latest company and position")
            return;
        }

        if (!data.location) {
            setErrorMessage("Please fill in your location.");
            return;
        }

        await request<IUser>({
            endpoint: `/api/v1/authentication/profile/${user?.id}?firstName=${data.firstName}&lastName=${data.lastName}&company=${data.company}&position=${data.position}&location=${data.location}`,
            method: "PUT",
            body: JSON.stringify(data),

            onSuccess: (data) => {
                setUser(data);
                navigate("/");
            },

            onFailure: (error) => {
                setErrorMessage(error);
            }
        })
    }

    return (
        <div className={classes.root}>
            <Box>
                <h1>Only one last step</h1>
                <p>Tell us a bit about yourself so we can personalize your experience.</p>

                {
                    step === 0 && (
                        <div className={classes.inputs}>
                            <Input
                                onFocus={() => setErrorMessage("")}
                                required
                                label="First Name"
                                name="firstName"
                                placeholder="John"
                                onChange={(e) => setData(
                                    (prev) => ({...prev, firstName: e.target.value})
                                )}
                            />

                            <Input
                                required
                                label="Last Name"
                                name="lastName"
                                placeholder="Doe"
                                onFocus={() => setErrorMessage("")}
                                onChange={(e) => setData((prev) => ({...prev, lastName: e.target.value}))}
                            />
                        </div>
                    )
                }



                {
                    step === 1 && (
                        <div className={classes.inputs}>
                            <Input
                                onFocus={() => setErrorMessage("")}
                                required
                                label="Latest Company"
                                name="firstName"
                                placeholder="Docker Inc."
                                onChange={(e) => setData(
                                    (prev) => ({...prev, company: e.target.value})
                                )}
                            />

                            <Input
                                required
                                label="Lastest Position"
                                name="position"
                                placeholder="Software Engineer"
                                onFocus={() => setErrorMessage("")}
                                onChange={(e) => setData((prev) => ({...prev, position: e.target.value}))}
                            />
                        </div>
                    )
                }


                {
                    step === 2 && (
                        <div className={classes.inputs}>
                            <Input
                                name="location"
                                label="Location"
                                placeholder="Lagos, Nigeria"
                                onFocus={() => setErrorMessage("")}
                                onChange={(e) => setData(
                                    (prev) => ({...prev, location: e.target.value})
                                )}
                            />
                        </div>
                    )
                }


                {
                    errorMessage && <p className={classes.error}>{errorMessage}</p>
                }


                <div className={classes.buttons}>
                    {
                        step > 0 && (
                            <Button
                                outline
                                onClick={() => setStep((prev) => prev - 1)}
                            >
                                Back
                            </Button>
                        )
                    }

                    {
                        step < 2 && (
                            <Button
                                disabled={
                                    (step === 0 && (!data.firstName || !data.lastName)) ||
                                    (step === 1 && (!data.company || !data.position))
                                }
                                onClick={() => setStep((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        )
                    }

                    {
                        step === 2 && (
                            <Button
                                disabled={!data.location}
                                onClick={onSubmit}
                            >
                                Submit
                            </Button>
                        )
                    }
                </div>
            </Box>
        </div>
    )
}

export default Profile
