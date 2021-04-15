import React, { useState } from "react";

interface Props {
    callback: (event) => void
    values: string[]
    displays: string[]
    description: string
}

export const Dropdown = ({ callback, values, displays, description }: Props) => {
    const [isInfoDisplayed, setInfoDisplayed] = useState(false);

    return (
        <div>
            <select className="menu-button"
                onMouseEnter={() => setInfoDisplayed(true)}
                onMouseLeave={() => setInfoDisplayed(false)}
                onClick={() => setInfoDisplayed(false)}
                onChange={callback}
            >
                {displays.map((display: string, index: number) =>
                    <option value={values[index]} key={index}>{display}</option>
                )}
            </select>

            <div className="menu-button-info" style={{ display: isInfoDisplayed ? "block" : "none" }}>
                {description}
            </div>
        </div>
    )
}