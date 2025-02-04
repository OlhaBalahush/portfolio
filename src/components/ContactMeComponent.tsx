import React, { useState } from 'react';
import './contact.scss';
import Cross from '../svgs/Cross';

interface ContactMeComponentProps {
  textLeave: () => void;
  linkEnter: () => void;
}

const ContactMeComponent: React.FC<ContactMeComponentProps> = ({ textLeave, linkEnter }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const ClickOnContactMe = () => {
    setIsClicked(true);
    setIsPaused(true);
  }

  const handleMouseLeave = () => {
    setIsClicked(false);
    setIsPaused(false);
  };

  return (
    <div className={`contact-me-box ${isClicked ? 'opened' : ''}`}>
      <div className={`contact-me-container ${isPaused ? 'paused' : ''}`}
        onClick={ClickOnContactMe}
        onMouseEnter={isClicked ? () => { } : linkEnter} onMouseLeave={textLeave}>
        <div className='scrolling-text main-text'>
          contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me -
        </div>
        <div className='scrolling-text main-text'>
          contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me - contact me -
        </div>
      </div>
      <div
        className={`contact-me-content`}
        onMouseLeave={handleMouseLeave}
      >
        <div className='contact-t'>
          <h4 className='contact-me-title'>Contact me on</h4>
          <button className='close-btn' onClick={handleMouseLeave}>
            <Cross />
          </button>
        </div>
        <div className='links-container'>
          <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link main-text' href='https://www.linkedin.com/in/olha-balahush-821811227/'>LinkedIn</a>
          <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link main-text' href='https://github.com/OlhaBalahush'>Github</a>
          <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link main-text' href='https://www.behance.net/olha-balahush'>Behance</a>
        </div>
      </div>
    </div>
  );
};

export default ContactMeComponent;
