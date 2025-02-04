import React from "../svgs/React";
import "./header.scss";

interface HeaderComponentProps {
    navs: string[]
}


const HeaderComponent: React.FC<HeaderComponentProps> = ({navs}) => {
    return(
        <header>
            <span>Olha Balahush</span>
            <div className="navs-container">
                {navs.map((title, i) => (
                    <span key={i}>{title}</span>
                ))}
            </div>
        </header>
    )
}

export default HeaderComponent;