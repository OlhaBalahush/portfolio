import { useState } from 'react';
import './basic.scss';
import './education.scss';

interface EducationComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const EducationComponent: React.FC<EducationComponentProps> = ({ textEnter, textLeave }) => {
    const educationData = [
        ['KPI', 'sep 2020 - may 2024', 'Software engineering'],
        ['kood/Johvi', 'nov 2022 - nov 2024', 'Software development'],
        ['Course UX design Google', 'oct 2023 - jan 2024', 'UX design'],
        ['Computer academy', 'sep 2017 - may 2020', 'Computer science']
    ];

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);

    return (
        <div className="page rows-page">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Education</h1>
            <div className="educations-container">
                {educationData.map((title, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onMouseLeave={handleMouseLeave}
                        className={`education-box ${i === hoveredIndex ? 'hovered' : ''} ${i === 0 ? 'first' : ''} ${i === educationData.length - 1 ? 'last' : ''}`}
                    >
                        <div className='education-content'>
                            <div className='education-text'>{title[0]}</div>
                            <div className='education-date'>{title[1]}</div>
                        </div>
                        <div className='education-content cloned'>
                            <div className='education-text'>{title[2]}</div>
                            {/* <div className='education-date'>{title[1]}</div> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationComponent;
