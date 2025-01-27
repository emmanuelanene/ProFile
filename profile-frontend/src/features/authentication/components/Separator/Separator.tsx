import {ReactNode} from "react";
import classes from "./Separator.module.scss"

function Separator({children} : {children: ReactNode}) {
    return (
        <div className={classes.separator}>{children}</div>
    )
}

export default Separator
