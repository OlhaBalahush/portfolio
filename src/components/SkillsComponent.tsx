import './basic.scss'
import './skills.scss'
import skillsIconsArray from '../svgs/SkillsIcons'

interface SkillsComponentProps {
    textEnter: () => void;
    iconEnter: () => void;
    textLeave: () => void;
}

const SkillsComponent: React.FC<SkillsComponentProps> = ({ textEnter, iconEnter, textLeave }) => {
    return (
        <div className="page rows-page">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Skills</h1>

            <div className='h-scroll-box vertical-line-scroll'>
                {skillsIconsArray.map((icon, index) => (
                    // TODO show icon.name in cursor
                    <div onMouseEnter={iconEnter} onMouseLeave={textLeave} key={icon.name} className='scrollable-item'>
                        {icon.component}
                    </div>
                ))}
                {skillsIconsArray.map((icon, index) => (
                    // TODO show icon.name in cursor
                    <div onMouseEnter={iconEnter} onMouseLeave={textLeave} key={icon.name} className='scrollable-item'>
                        {icon.component}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SkillsComponent;