import { color } from 'framer-motion';
import './basic.scss'

interface IntroComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const IntroComponent: React.FC<IntroComponentProps> = ({ textEnter, textLeave }) => {
    return (
        <div className="page page-height">
            <div>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Welcome, here!</h1>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>I’m Olha Balahush</h1>
                <span onMouseEnter={textEnter} onMouseLeave={textLeave}>And it’s my website. Enjoy!</span>
                <br />
                <span onMouseEnter={textEnter} onMouseLeave={textLeave} style={{color: 'gray', fontSize: '12px'}}>The website is currently under development and is not yet ready.</span>
            </div>
        </div>
    )
}

export default IntroComponent;