import React, { useRef, useEffect } from 'react';
import './basic.scss'
import './projects.scss'

import ProjectComponent from './ProjectComponent';

interface ProjectsComponentProps {
    textEnter: () => void;
    textLeave: () => void;
    linkEnter: () => void;
}

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ textEnter, textLeave, linkEnter }) => {

    return (
        <div className="page rows-page">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Projects</h1>
            
            <div className='projects-container'>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='01_FORUM' 
                    description={'Dive into the user-friendly web forum, a digital hub for vibrant conversations and community engagement. This project centers around a sleek, easy-to-navigate platform where users can share thoughts, comment on posts, and express their opinions with likes or dislikes. Our forum offers dynamic content filtering by categories and dates, and a nifty sorting feature to view posts based on popularity.'} 
                    link={'https://github.com/OlhaBalahush/go-app-sql-db'} 
                    isRight={false}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='02_Tetris' 
                    description={'Get ready to be hooked with our web-based Tetris game! This classic game has been reimagined and brought to life using a modern tech blend of JavaScript, Golang, HTML, and CSS. It is all about smooth, seamless gameplay - say goodbye to annoying lags and frame drops.'} 
                    link={'https://github.com/OlhaBalahush/tetris'} 
                    isRight={true}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='03_SORK' 
                    description={'This project involves the creation of a feature-rich social networking platform, inspired by popular social networks like Facebook.'} 
                    link={'https://github.com/OlhaBalahush/SORK'} 
                    isRight={false}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='04_Bomberman' 
                    description={'description'} 
                    link={'https://github.com/OlhaBalahush/bomberman'} 
                    isRight={true}/>
                {/* <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='05_some other' 
                    description={'An multiplayer game based on Bomberman.'} 
                    link={''} 
                    isRight={false}/> */}
            </div>
        </div>
    )
}

export default ProjectsComponent;
