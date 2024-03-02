import React, { useRef, useEffect } from 'react';
import './basic.scss'
import './projects.scss'

import { motion } from "framer-motion";

interface ProjectsComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const ProjectsComponent: React.FC<ProjectsComponentProps> = ({ textEnter, textLeave }) => {
    // v1
    // const containerRef = useRef<HTMLDivElement>(null);

    // const handleWheel = (e: WheelEvent) => {
    //     if (containerRef.current) {
    //         e.preventDefault();
    //         containerRef.current.scrollBy({
    //             left: e.deltaY * 10, // Adjust scrolling speed as needed
    //             behavior: 'smooth'
    //         });
    //     }
    // };

    // useEffect(() => {
    //     const container = containerRef.current;
    //     if (container) {
    //         // Attach the event listener directly to the container
    //         container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    //     }
    //     return () => {
    //         if (container) {
    //             container.removeEventListener('wheel', handleWheel as EventListener);
    //         }
    //     };
    // }, []);
    // v2
    // const containerRef = useRef<HTMLDivElement>(null);

    // const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    //     if (containerRef.current) {
    //         const container = containerRef.current;
    //         const isAtStart = container.scrollLeft === 0;
    //         const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

    //         if ((e.deltaY < 0 && isAtStart) || (e.deltaY > 0 && isAtEnd)) {
    //             return; // Allow normal page scrolling at the start/end
    //         }

    //         const scrollAmount = e.deltaY * 2; // Adjust this multiplier as needed
    //         container.scrollLeft += scrollAmount;
    //         e.preventDefault();
    //     }
    // };
    // v3
    // const containerRef = useRef<HTMLDivElement>(null);
    // const [isSticky, setIsSticky] = useState(false);

    // const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    //     if (containerRef.current) {
    //         const container = containerRef.current;
    //         const isAtStart = container.scrollLeft === 0;
    //         const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth;

    //         if ((e.deltaY < 0 && isAtStart) || (e.deltaY > 0 && isAtEnd)) {
    //             setIsSticky(false);
    //             return; // Allow normal page scrolling at the start/end
    //         }

    //         setIsSticky(true); // Make the container sticky
    //         const scrollAmount = e.deltaY * 2;
    //         container.scrollLeft += scrollAmount;
    //         e.preventDefault();
    //     }
    // };
    // v4
    const containerRef = useRef<HTMLDivElement>(null);

    const disablePageScroll = () => {
        document.body.style.overflow = 'hidden';
    };

    const enablePageScroll = () => {
        document.body.style.overflow = '';
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += e.deltaY; // Adjust horizontal scroll based on vertical scroll
            e.preventDefault();
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        container?.addEventListener('mouseenter', disablePageScroll);
        container?.addEventListener('mouseleave', enablePageScroll);

        return () => {
            container?.removeEventListener('mouseenter', disablePageScroll);
            container?.removeEventListener('mouseleave', enablePageScroll);
        };
    }, []);

    return (
        <div className="page rows-page">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Projects</h1>

            <section className="projects-container" ref={containerRef} onWheel={handleWheel}>
                <div className="project-box">1</div>
                <div className="project-box">2</div>
                <div className="project-box">3</div>
                <div className="project-box">4</div>
                <div className="project-box">5</div>
                <div className="project-box">6</div>
                <div className="project-box">7</div>
            </section>
        </div>
    )
}

export default ProjectsComponent;
