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
            </div>
        </div>
    )
}

export default IntroComponent;