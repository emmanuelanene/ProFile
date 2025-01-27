import {useEffect} from "react";

function UsePageTitle(title: string) {
    useEffect(() => {
        document.title = "LinkedIn | " + title;
    }, [title]);
}

export default UsePageTitle
