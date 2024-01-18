import React, { useRef, useEffect } from 'react';
import './basic.scss'
import './lastPage.scss'

import { motion } from "framer-motion";
import ProjectComponent from './ProjectComponent';

interface ByeComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const ByeComponent: React.FC<ByeComponentProps> = ({ textEnter, textLeave }) => {
    
    return (
        <div className="page center">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Thank you!</h1>
            <p>You can contact me here</p>
        </div>
    )
}

export default ByeComponent;
