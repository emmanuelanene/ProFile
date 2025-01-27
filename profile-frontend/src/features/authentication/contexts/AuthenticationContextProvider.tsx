import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Outlet, useLocation} from "react-router-dom";
import {request} from "../../../utils/api.ts";
import Loader from "../../../components/Loader/Loader.tsx";
import {Navigate} from "react-router-dom";

interface IAuthenticationResponse {
    token: string;
    message: string;
}

export interface IUser {
    id: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    location?: string;
    profileComplete: boolean;
    profilePicture?: string;
}

interface IAuthenticationContextType {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
}

const AuthenticationContext = createContext<IAuthenticationContextType | null>(null)

export function useAuthenticationContext() {
    return useContext(AuthenticationContext)!;
}

function AuthenticationContextProvider() {
    const location = useLocation();

    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isOnAuthPage =
        location.pathname === "/authentication/login" ||
        location.pathname === "/authentication/signup" ||
        location.pathname === "/authentication/request-password-reset";


    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------


    const login = async(email: string, password: string) => {
        await request<IAuthenticationResponse>({
            endpoint: "/api/v1/authentication/login",
            method: "POST",
            body: JSON.stringify({ email, password }),

            onSuccess: ({token}) => {
                localStorage.setItem("token", token);
            },

            onFailure: (error) => {
                throw new Error(error);
            },
        });
    };


    const signup = async(email: string, password: string)=> {
        await request<IAuthenticationResponse>({
            endpoint: "/api/v1/authentication/signup",
            method: "POST",
            body: JSON.stringify({email, password}),

            onSuccess: ({ token }) => {
                localStorage.setItem("token", token);
            },

            onFailure: (error) => {
                throw new Error(error);
            }
        });
    };


    const logout = async() => {
        localStorage.removeItem("token");
        setUser(null);
    }




    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------




    useEffect(() => {
        if(user) {
            return;
        }

        setIsLoading(true);

        const fetchUser = async() => {
            await request<IUser | null>({
                endpoint: "/api/v1/authentication/user",

                onSuccess: (data) => {
                    setUser(data)
                },

                onFailure: (error) => {
                    console.log(error);
                }
            });

            setIsLoading(false);
        };

        fetchUser();

    }, [user, location.pathname]);


    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------


    // if (isLoading) {
    //     return <Loader />
    // }
    //
    // if(!isLoading && !user && !isOnAuthPage) {
    //     return <Navigate to={`/authentication/login`}/>
    // }
    //
    // if(user && !user.emailVerified && location.pathname !== "/authentication/verify-email") {
    //     return <Navigate to={`/authentication/verify-email`} />;
    // }
    //
    // if(user && user.emailVerified && location.pathname === "/authentication/verify-email") {
    //     return <Navigate to={`/`} />;
    // }
    //
    // if (
    //     user && user.emailVerified && !user.profileComplete && !location.pathname.includes("/authentication/profile")
    // ) {
    //     return <Navigate to={`/authentication/profile/${user.id}`} />
    // }
    //
    // if (
    //     user && user.emailVerified && user.profileComplete && location.pathname.includes("/authentication/profile")
    // ) {
    //     return <Navigate to={`/`} />
    // }
    //
    // if(user && isOnAuthPage) {
    //     return <Navigate to={`/`} />
    // }



    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------
    // ----------------------------------------------




    const value = {
        user,
        login,
        logout,
        signup,
        setUser
    }




    return (
        <AuthenticationContext.Provider value={value}>
            <Outlet />
        </AuthenticationContext.Provider>
    )
}

export default AuthenticationContextProvider
