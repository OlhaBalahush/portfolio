import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import './app.scss';
import { motion, Variants } from 'framer-motion';
import IntroComponent from './components/IntroComponent';
import ContactMeComponent from './components/ContactMeComponent';
import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax'
import EducationComponent from './components/EducationComponent';
import AboutTextComponent from './components/AboutTextcomponent'
import SkillsComponent from './components/SkillsComponent';
import ProjectsComponent from './components/ProjectsComponent';
import ByeComponent from './components/LastPageComponent';
import HeaderComponent from './components/HeaderComponent';
import './components/project.scss'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  const ref = useRef<IParallax>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [height, setHeight] = useState(0);
  let factor = height / window.innerHeight;

  useEffect(() => {
    console.log('contentRef.current:', contentRef.current);
    if (contentRef.current) {
      setHeight(contentRef.current.clientHeight);
      console.log(contentRef.current.clientHeight)
      factor = height / window.innerHeight;
      console.log(factor)
    }
    console.log("here")
  }, [contentRef]);


  const textEnter = () => setCursorVariant('text')
  const linkEnter = () => setCursorVariant('link')
  const iconEnter = () => setCursorVariant('iconWithText')
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

  useEffect(() => {
    // Disable scroll
    const preventScroll = (e: { preventDefault: () => any; }) => e.preventDefault();
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // Enable scroll after 2.5 seconds
    setTimeout(() => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.classList.add('show-scrollbar');
    }, 5000);


    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
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
      // mixBlendMode: "difference"
      display: window.innerWidth <= 1048 ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      color: 'white', // Text color
      fontSize: '12px',
    },
    iconWithText: {
      height: 50, // adjust size as needed
      width: 50,  // adjust size as needed
      x: mousePosition.x - 25, // adjust for the new size
      y: mousePosition.y - 25, // adjust for the new size
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
      color: 'white', // text color
      display: window.innerWidth <= 1048 ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%', // optional, for rounded corners
      // Add any additional styling as needed
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
        >
          {cursorVariant === 'link' && (
              <span>Click Here</span> // Text displayed when in 'link' state
          )} </motion.div>
        <ContactMeComponent linkEnter={linkEnter} textLeave={textLeave}/>

        <header>
          <span className="span-btn" key={4} onMouseEnter={textEnter} onMouseLeave={textLeave} onClick={() => ref.current?.scrollTo(0)}>Olha Balahush</span>
          <div className="navs-container">
            <span className="span-btn" key={0} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => ref.current?.scrollTo(0.85)}>About</span>
            <span className="span-btn" key={1} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => ref.current?.scrollTo(1.55)}>Education</span>
            <span className="span-btn" key={2} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => ref.current?.scrollTo(2.4)}>Projects</span>
            <span className="span-btn" key={3} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => ref.current?.scrollTo(10)}>Contact</span>
          </div>
        </header>

        <div className='App'>
          <Parallax pages={11} ref={ref}>
            <ParallaxLayer
                offset={0}
                speed={0.5}>
              <IntroComponent textEnter={textEnter} textLeave={textLeave}/>
            </ParallaxLayer>

            <ParallaxLayer
                offset={0.8}
                speed={0.05}>
              <div className="first-arrow">
                <svg
                    className='to-page-center arrow'
                    width="38" height="103" viewBox="0 0 38 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M17.2322 101.768C18.2085 102.744 19.7915 102.744 20.7678 101.768L36.6777 85.8579C37.654 84.8816 37.654 83.2986 36.6777 82.3223C35.7014 81.346 34.1184 81.346 33.1421 82.3223L19 96.4645L4.85787 82.3223C3.88156 81.346 2.29864 81.346 1.32233 82.3223C0.346023 83.2986 0.346023 84.8816 1.32233 85.8579L17.2322 101.768ZM16.5 1.09278e-07L16.5 100L21.5 100L21.5 -1.09278e-07L16.5 1.09278e-07Z"
                      fill="black"/>
                </svg>
              </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={1.1}
                speed={0.4}
                factor={4}
            >
              <div className="page ux-cases-page">
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave}>About</h1>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Product Designer | 5+ Years in Software Engineering & UI / UX Design.
                  Specializing in user-centered design, high-impact interfaces, and design systems. Skilled in leading design initiatives, cross-functional collaboration, and user research to create seamless, functional solutions.
                   Focused on continuous learning, accessibility, and maintaining design consistency across products</p>
                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>Current Focus</h5>
                <div className="horizontal-line"></div>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>As a UI/UX Designer at kood/Jõhvi, I’m designing a studying platform that enhances engagement and user satisfaction. My approach is driven by empathy, aligning user needs with business goals to craft intuitive, functional interfaces.
                  By leveraging user research and business insights, I create scalable, impactful solutions that contribute to both UX excellence and product success</p>
              </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={1.9}
                speed={0.25}
                factor={4}
            >
              <EducationComponent textEnter={textEnter} textLeave={textLeave}/>
            </ParallaxLayer>

            <ParallaxLayer
                offset={2.75}
                speed={0.4}
                factor={4}>
              <div className="page">
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Projects</h1>
              </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={2.95}
                speed={0.25}
                factor={factor}>
              <div className="page ux-cases-page" ref={contentRef}>
                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>UX Cases</h5>
                <div className="horizontal-line"></div>
                <div className="row">
                  <h1 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>01</h1>
                  <div className=""></div>
                  <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>Integration of Community
                    into the Studying Platform</h2></div>

                <div className="btns-container">
                  <button onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => ref.current?.scrollTo(3.1)}>Research Phase
                  </button>
                  <button onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => ref.current?.scrollTo(3.9)}>Ideation & Solution Design
                  </button>
                  <button onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => ref.current?.scrollTo(4.5)}>Prototyping & Testing
                  </button>
                  <button onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => ref.current?.scrollTo(5)}>MVP Launch – Fake Door Experiment
                  </button>
                  <button onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => ref.current?.scrollTo(5.5)}>Conclusion & Impact
                  </button>
                </div>

                <div className="pic-container prev full">
                  <img src={`${process.env.PUBLIC_URL + '/community.png'}`}></img>
                </div>

                <h4 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>01 Research Phase</h4>

                <div className="row" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Overview</h6>
                  <div className="line"></div>
                  <p>The goal of this research was to understand what causes a lack of motivation in students, as
                    inactivity
                    was a major issue observed on the platform.
                    Through secondary research, I analyzed existing studies and research papers related to student
                    engagement, motivation, and online learning behavior. This helped me identify key themes and gaps
                    that
                    required further exploration through user interviews</p>
                </div>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>User Interviews</h5>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/UR-summary.png'}`}></img>
                </div>

                <div className="row" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Objective</h6>
                  <div className="line"></div>
                  <p>The user interviews were designed to:
                    <ul>
                      <li>Gain insights into students' study experiences</li>
                      <li>Understand what motivates students</li>
                      <li>Identify the obstacles students face while studying</li>
                      <li>Uncover key pain points</li>
                      <li>Validate assumptions about user personas</li>
                    </ul>
                  </p>
                </div>

                <div className="row" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Methodology</h6>
                  <div className="line"></div>
                  <p>A semi-structured interview format was chosen, allowing flexibility to explore deeper insights into
                    students’ pain points and motivations</p>
                </div>

                <div className="row" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Key Findings</h6>
                  <div className="line"></div>
                  <p>After conducting user interviews, the most prominent pain point emerged:
                    <br></br>
                    Lack of community feeling among students—Many students felt isolated in their learning journey,
                    which
                    negatively impacted motivation and engagement</p>
                </div>

                <h4 onMouseEnter={textEnter} onMouseLeave={textLeave}>Ideation & Solution Design</h4>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/brainstorming.png'}`}></img>
                </div>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>Brainstorming</h5>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>To generate solutions, I facilitated a
                  brainstorming session with team members, including product
                  managers, engineers, and designers. Key areas of focus included:</p>
                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>Collaboration & study groups</li>
                  <li>Mentorship opportunities</li>
                  <li>Job preparation support</li>
                  <li>Progress tracking & engagement features</li>
                </ul>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Top ideas generated included:</p>
                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>Teammate search feature – Helps students find study partners</li>
                  <li>Project showcase system – Allows students to share and discuss their work</li>
                  <li>Alumni & partner mentorship system – Connects students with industry professionals</li>
                  <li>Community-driven events – Organizing hackathons, study groups, and networking events</li>
                </ul>

                <h4 onMouseEnter={textEnter} onMouseLeave={textLeave}>Prototyping & Testing</h4>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Before developing a full-fledged solution, I
                  created low-fidelity wireframes to map out the key
                  user
                  flows and interactions. After iterating based on internal feedback, I refined them into
                  high-fidelity
                  prototypes for usability testing</p>

                <div className="pic-container full">
                  <img src={`${process.env.PUBLIC_URL + '/testing.png'}`}></img>
                </div>

                <div className="row" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Usability Testing</h6>
                  <div className="line"></div>
                  <p>A moderated usability test with real users was conducted to validate design choices. Key takeaways
                    included:
                    <ul>
                      <li>A clearer user onboarding process for the new feature</li>
                      <li>More intuitive navigation for finding study partners</li>
                      <li>Better integration of the community aspect within the platform</li>
                    </ul>
                  </p>
                </div>

                <h4 onMouseEnter={textEnter} onMouseLeave={textLeave}>MVP Launch – Fake Door Experiment</h4>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/fake-door.png'}`}></img>
                </div>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>To test user interest in the teammate search
                  feature, we implemented a Fake Door Test:</p>
                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>A simple student list was added to specific tasks</li>
                  <li>A trackable button allowed users to explore potential study partners</li>
                </ul>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>Results & Key Takeaways</h5>


                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>40% of users engaged with the feature within a
                  week. The strong engagement validated the need for a
                  fully developed teammate search feature. Based on these insights, we proceeded with full
                  development</p>

                <h4 onMouseEnter={textEnter} onMouseLeave={textLeave}>Conclusion & Impact</h4>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>By integrating community features into the studying
                  platform, we addressed a critical engagement
                  issue,
                  helping students feel more connected in their learning journey.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Key Outcomes:</p>
                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>Higher student activity post-launch</li>
                  <li>Increased peer collaboration and study group formation</li>
                  <li>Positive user feedback on mentorship and networking opportunities</li>
                </ul>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Next Steps & Future Improvements:</p>
                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>Refine the teammate search feature with filters and AI-driven suggestions</li>
                  <li>Expand the mentorship program with structured events and industry partnerships</li>
                  <li>Enhance gamification & progress tracking elements to boost long-term engagement</li>
                </ul>
              </div>
            </ParallaxLayer>

            <ParallaxLayer
                offset={factor ? 2.65 + factor : 7.95}
                speed={0.3}
                factor={4}>
              <ProjectsComponent textEnter={textEnter} linkEnter={linkEnter} textLeave={textLeave}/>
            </ParallaxLayer>

            <ParallaxLayer
                offset={10}
                speed={1}
                factor={4}>
              <ByeComponent textEnter={textEnter} textLeave={textLeave}/>
            </ParallaxLayer>

            <ParallaxLayer
                offset={10.65}
                speed={1.25}>
              <svg
                  className='to-page-center arrow'
                  width="38" height="103" viewBox="0 0 38 103" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.2322 101.768C18.2085 102.744 19.7915 102.744 20.7678 101.768L36.6777 85.8579C37.654 84.8816 37.654 83.2986 36.6777 82.3223C35.7014 81.346 34.1184 81.346 33.1421 82.3223L19 96.4645L4.85787 82.3223C3.88156 81.346 2.29864 81.346 1.32233 82.3223C0.346023 83.2986 0.346023 84.8816 1.32233 85.8579L17.2322 101.768ZM16.5 1.09278e-07L16.5 100L21.5 100L21.5 -1.09278e-07L16.5 1.09278e-07Z"
                    fill="black"/>
              </svg>
            </ParallaxLayer>

          </Parallax>
        </div>
      </>
  );
}

export default App;