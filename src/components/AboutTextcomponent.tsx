import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import './basic.scss'

interface AboutTextComponentProps {
    textEnter: () => void;
    textLeave: () => void;
    text: String;
    isSmall: Boolean;
    isLeft: Boolean;
}

const AboutTextComponent: React.FC<AboutTextComponentProps> = ({ textEnter, textLeave, text, isSmall, isLeft}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 1.5 }
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className={`page  ${ !isLeft ? 'right-text': null}`}>
            <span onMouseEnter={textEnter} onMouseLeave={textLeave} 
            className={`${isSmall ? 'additional-text': 'about-text'}  
                scroll-visibility`}>
                {text}</span>
        </motion.div>
    )
}

export default AboutTextComponent;