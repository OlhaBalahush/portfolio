import './basic.scss'

interface EducationComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const EducationComponent:React.FC<EducationComponentProps> = ({ textEnter, textLeave }) => {
    return(
        <div className="page">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Education</h1>
            {/* TODO:  */}
        </div>
    )
}

export default EducationComponent;