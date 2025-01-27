import classes from "./Input.module.scss"
import {InputHTMLAttributes} from "react";


interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    size?: "small" | "medium" | "large";
}

function Input({ label, size, width, ...others }: IInputProps) {
    return (
        <div className={`${classes.root} ${classes[size || "large"]}`}>
            {
                label ? (
                    <label className={classes.label} htmlFor={others.id}>
                        {label}
                    </label>
                ) : null
            }

            <input
                {...others}
                style={{
                    width: width ? `${width}px` : "100%"
                }}
            />
        </div>
    )
}

export default Input
