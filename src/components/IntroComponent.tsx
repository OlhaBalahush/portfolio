import './basic.scss'
import './intro.scss'
import { useDrift } from '../hooks/useDrift';

interface IntroComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const IntroComponent: React.FC<IntroComponentProps> = ({ textEnter, textLeave }) => {
    const arrowDrift = useDrift<HTMLDivElement>(-0.2);

    return (
        <div className="page page-height">
            <div style={{width: '100%'}}>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title first-line'>Welcome, here!</h1>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title second-line'>I’m Olha Balahush</h1>
                <div className="horizontal-line third-line"></div>
                <span className="main-text third-line" onMouseEnter={textEnter} onMouseLeave={textLeave}>I focus on people's problems, and craft solutions that fill the need and stick</span>
                <div className="scroll-cue-arrow-slot" ref={arrowDrift}>
                    <div className="scroll-cue-arrow">
                        <svg
                            className='to-page-center arrow'
                            width="38" height="103" viewBox="0 0 38 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.2322 101.768C18.2085 102.744 19.7915 102.744 20.7678 101.768L36.6777 85.8579C37.654 84.8816 37.654 83.2986 36.6777 82.3223C35.7014 81.346 34.1184 81.346 33.1421 82.3223L19 96.4645L4.85787 82.3223C3.88156 81.346 2.29864 81.346 1.32233 82.3223C0.346023 83.2986 0.346023 84.8816 1.32233 85.8579L17.2322 101.768ZM16.5 1.09278e-07L16.5 100L21.5 100L21.5 -1.09278e-07L16.5 1.09278e-07Z"
                                fill="black"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IntroComponent;