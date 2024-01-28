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
                    pictureLink={'https://cdn.discordapp.com/attachments/1075493710692876330/1199423364872290405/Screenshot_from_2024-01-23_20-40-02.png?ex=65c27d0e&is=65b0080e&hm=446a4960d91a312cce4a03e6d33a48d8413ddbd5476c9fa9055b04c18b9bb441&'}
                    isRight={false}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='02_Tetris' 
                    description={'Get ready to be hooked with our web-based Tetris game! This classic game has been reimagined and brought to life using a modern tech blend of JavaScript, Golang, HTML, and CSS. It is all about smooth, seamless gameplay - say goodbye to annoying lags and frame drops.'} 
                    link={'https://github.com/OlhaBalahush/tetris'} 
                    pictureLink={'https://cdn.discordapp.com/attachments/1075493710692876330/1199431913174212679/Screenshot_from_2024-01-23_21-14-00.png?ex=65c28504&is=65b01004&hm=8446fe1a37aad02b931555f301fdf317921c6c843c178ccd3c3200ef4dcc693c&'}
                    isRight={true}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='03_SORK' 
                    description={'This project involves the creation of a feature-rich social networking platform, inspired by popular social networks like Facebook.'} 
                    link={'https://github.com/OlhaBalahush/SORK'} 
                    pictureLink={'https://cdn.discordapp.com/attachments/1075493710692876330/1199429701396078774/Screenshot_from_2024-01-23_21-04-47.png?ex=65c282f5&is=65b00df5&hm=24d22a153620e66d6f8e8630bb0246cdaa9a2ae6a0a767907afd7a58ae15900d&'}
                    isRight={false}/>
                <ProjectComponent 
                    textEnter={textEnter} textLeave={textLeave} linkEnter={linkEnter}
                    name='04_Bomberman' 
                    description={'An multiplayer game based on Bomberman.'} 
                    link={'https://github.com/OlhaBalahush/bomberman'} 
                    pictureLink={'https://cdn.discordapp.com/attachments/1075493710692876330/1201271360320704653/image.png?ex=65c93622&is=65b6c122&hm=88ad0f5163f79cb72602a42cd3ed5e3bcd1713ee86df667de2545590dc335ae8&'}
                    isRight={true}/>
            </div>
        </div>
    )
}

export default ProjectsComponent;
