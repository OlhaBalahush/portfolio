import { color, motion } from 'framer-motion';
import './basic.scss'
import './intro.scss'
import {useEffect, useState} from "react";

interface IntroComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const IntroComponent: React.FC<IntroComponentProps> = ({ textEnter, textLeave }) => {
    return (
        <div className="page page-height">
            <div>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title first-line'>Welcome, here!</h1>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title second-line'>I’m Olha Balahush</h1>
                <div className="horizontal-line third-line"></div>
                <span className="main-text third-line" onMouseEnter={textEnter} onMouseLeave={textLeave}>A designer and developer passionate about crafting intuitive, user-centered digital experiences. I focus on usability, accessibility, and seamless interactions, bridging the gap between design, development, and product strategy to create impactful solutions</span>
            </div>
        </div>
    )
}

export default IntroComponent;