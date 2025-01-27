import classes from "./Box.module.scss"
import {ReactNode} from "react";

function Box({children} : {children: ReactNode}) {
    return (
        <div className={classes.root}>
            {children}
        </div>
    )
}

export default Box
