import React from 'react';
import './basic.scss'
import './lastPage.scss'

import { useRevealOnView } from '../hooks/useRevealOnView';
import { useDrift } from '../hooks/useDrift';

interface ByeComponentProps {
    textEnter: () => void;
    textLeave: () => void;
}

const ByeComponent: React.FC<ByeComponentProps> = ({ textEnter, textLeave }) => {
    const arrowReveal = useRevealOnView<HTMLDivElement>();
    const arrowDrift = useDrift<HTMLDivElement>(-0.4);

    return (
        <div className="page center">
            <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Thank you!</h1>
            <p style={{ margin: 0 }}>Find me here</p>
            <div className="scroll-cue-arrow-slot bye-arrow-slot" ref={arrowDrift}>
                <div className={`${arrowReveal.isVisible ? 'is-visible' : ''}`} ref={arrowReveal.ref}>
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
    )
}

export default ByeComponent;
