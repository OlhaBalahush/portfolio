import React, { useRef, useEffect } from 'react';
import './basic.scss'
import './project.scss'

import { motion } from "framer-motion";

interface ProjectComponentProps {
    textEnter: () => void;
    textLeave: () => void;
    linkEnter: () => void;
    name: String;
    description: String;
    link: String;
    pictureLink: String;
    isRight: Boolean;
}

const ProjectComponent: React.FC<ProjectComponentProps> = ({ textEnter, textLeave, linkEnter, name, description, link, pictureLink, isRight }) => {

    return (
        <div className='project-container'>
            {isRight ? (
                <>
                    <div className='project-description is-right'>
                        <h1 onMouseEnter={textEnter} onMouseLeave={textLeave}>{name.split('_')[0]}</h1>
                        <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>{name.split('_')[1]}</h2>
                        <p onMouseEnter={textEnter} onMouseLeave={textLeave}>{description}</p>
                    </div>
                    <div className='line'>
                        <div className='line-circle'></div>
                    </div>
                    <a className="project-content" href={`${link}`} onMouseEnter={linkEnter} onMouseLeave={textLeave} >
                        <img src={`${pictureLink}`}></img>
                    </a>
                </>
            ) : (
                <>
                    <a className="project-content" href={`${link}`} onMouseEnter={linkEnter} onMouseLeave={textLeave}>
                        <img src={`${pictureLink}`}></img>
                    </a>
                    <div className='line'>
                        <div className='line-circle' ></div>
                    </div>
                    <div className='project-description'>
                        <h1 onMouseEnter={textEnter} onMouseLeave={textLeave}>{name.split('_')[0]}</h1>
                        <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>{name.split('_')[1]}</h2>
                        <p onMouseEnter={textEnter} onMouseLeave={textLeave}>{description}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default ProjectComponent;