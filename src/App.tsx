import { useState, useEffect, useRef } from 'react';
import './app.scss';
import { motion, Variants } from 'framer-motion';
import IntroComponent from './components/IntroComponent';
import ContactMeComponent from './components/ContactMeComponent';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax'
import EducationComponent from './components/EducationComponent';
import AboutTextComponent from './components/AboutTextcomponent'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  const ref = useRef<IParallax>(null);

  const textEnter = () => setCursorVariant('text')
  const textLeave = () => setCursorVariant('default')

  useEffect(() => {
    const mouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const cursorVariants: Variants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: 'black',
      x: mousePosition.x - 16,
      y: mousePosition.y - 16
    },
    text: {
      height: 100,
      width: 100,
      x: mousePosition.x - 50,
      y: mousePosition.y - 50,
      backgroundColor: 'white',
      mixBlendMode: "difference"
    },
    link: {
      height: 100,
      width: 100,
      x: mousePosition.x - 50,
      y: mousePosition.y - 50,
      mixBlendMode: "difference"
    }
  };

  return (
    <>
      <motion.div
        className='cursor'
        variants={cursorVariants}
        animate={cursorVariant}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      <ContactMeComponent />
      <div className='App'>
        <Parallax pages={5} ref={ref}>
          <ParallaxLayer
            offset={0}
            speed={0.5}
            onClick={() => ref.current?.scrollTo(3)}>
            <IntroComponent textEnter={textEnter} textLeave={textLeave} />
          </ParallaxLayer>

          <ParallaxLayer
            offset={0.8}
            speed={0.05}>
            <svg
              className='to-page-center'
              width="38" height="103" viewBox="0 0 38 103" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.2322 101.768C18.2085 102.744 19.7915 102.744 20.7678 101.768L36.6777 85.8579C37.654 84.8816 37.654 83.2986 36.6777 82.3223C35.7014 81.346 34.1184 81.346 33.1421 82.3223L19 96.4645L4.85787 82.3223C3.88156 81.346 2.29864 81.346 1.32233 82.3223C0.346023 83.2986 0.346023 84.8816 1.32233 85.8579L17.2322 101.768ZM16.5 1.09278e-07L16.5 100L21.5 100L21.5 -1.09278e-07L16.5 1.09278e-07Z" fill="black" />
            </svg>
          </ParallaxLayer>

          <ParallaxLayer
            offset={1.5}
            speed={0.05}
            factor={2}
            // style={{height: '100px'}}
            >
            <AboutTextComponent
              textEnter={textEnter}
              textLeave={textLeave}
              isSmall={false}
              isLeft={true}
              text={`Join me on my professional journey`} />
          </ParallaxLayer>

          <ParallaxLayer
            offset={1.8}
            speed={0.5}
            factor={2}>
            <AboutTextComponent
              textEnter={textEnter}
              textLeave={textLeave}
              isSmall={false}
              isLeft={true}
              text={`Let's get acquainted`} />
          </ParallaxLayer>

          <ParallaxLayer
            offset={2.3}
            speed={0.25}
            factor={2}>
            <AboutTextComponent
              textEnter={textEnter}
              textLeave={textLeave}
              isSmall={false}
              isLeft={false}
              text={`I'm Olya – a software developer, UI/UX designer, and an ardent artist`} />
          </ParallaxLayer>

          <ParallaxLayer
            offset={3}
            speed={0.5}
            factor={2}>
            <AboutTextComponent
              textEnter={textEnter}
              textLeave={textLeave}
              isSmall={false}
              isLeft={true}
              text={`Let me share my journey with you`} />
          </ParallaxLayer>

          <ParallaxLayer
            offset={3.6}
            speed={0.5}
            factor={2}>
            <AboutTextComponent
              textEnter={textEnter}
              textLeave={textLeave}
              isSmall={true}
              isLeft={false}
              text={`By the way, it’s my power place and my favourite mountain Hoverla.`} />
          </ParallaxLayer>

          <ParallaxLayer
            style={{width: 'auto'}}
            sticky={{ start: 0.8, end: 2.95 }}
            className='parallax-page about-character'>
            <img
              src='https://cdn.discordapp.com/attachments/1067003287691333642/1178334892375945296/sun_1.png?ex=6575c4e2&is=65634fe2&hm=605d08f542381b5b83e665b5e84b4a9d8228267e60b85559243cebc9c5648507&'
            />
          </ParallaxLayer>

          <ParallaxLayer
            speed={1}
            factor={4}
            sticky={{ start: 3.4, end: 3.4 }}
            style={{ zIndex: 3, height: '500px' }}>
            <img
              className='to-page-center'
              src='https://cdn.discordapp.com/attachments/1067003287691333642/1178035411994558605/mountains.png?ex=6574adf9&is=656238f9&hm=103db8075d9429232f7ddb8825a329313346418145de0dba2a0a8b92d97b4beb&'
            />
          </ParallaxLayer>

          <ParallaxLayer
            offset={4}
            speed={1}
            factor={4}>
            <EducationComponent textEnter={textEnter} textLeave={textLeave} />
          </ParallaxLayer>

        </Parallax>
      </div>
    </>
  );
}

export default App;
