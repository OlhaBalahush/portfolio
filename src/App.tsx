import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import './app.scss';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import IntroComponent from './components/IntroComponent';
import ContactMeComponent from './components/ContactMeComponent';
import EducationComponent from './components/EducationComponent';
import ProjectsComponent from './components/ProjectsComponent';
import ByeComponent from './components/LastPageComponent';
import './components/project.scss'

// The intro's entrance animation and the arrow reveals are timed from page load / scroll
// position, so if the browser restores the previous scroll position on reload (the
// default in Chrome/Firefox), you'd land mid-page while those animations assume you're
// at the top. Opting out here so a reload always starts clean, at the top, animations
// replaying -- runs once at module load, well before mount.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const CURSOR_HALF_SIZE: Record<string, number> = {
  default: 16,
  text: 50,
  link: 50,
  iconWithText: 25,
};

function App() {
   const rawCursorX = useMotionValue(-100);
  const rawCursorY = useMotionValue(-100);
  // A touch of spring smoothing on top of the raw, per-frame position -- tight enough
  // stiffness/damping that it still reads as precise, not laggy.
  const cursorX = useSpring(rawCursorX, { stiffness: 800, damping: 40, mass: 0.5 });
  const cursorY = useSpring(rawCursorY, { stiffness: 800, damping: 40, mass: 0.5 });
  const cursorOffsetRef = useRef(CURSOR_HALF_SIZE.default);
  const [cursorVariant, setCursorVariant] = useState('default');
  // Custom cursor makes no sense on touch input -- there's no hovering pointer to
  // track, and without continuous mousemove events it just sits stuck wherever the
  // last synthetic tap landed. Detect real touch capability rather than viewport
  // width, since a wide tablet or touchscreen laptop should still hide it.
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const CASE_STUDY_COUNT = 4;

  const caseStudy1IdeationRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy1PrototypingRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy1MvpRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy1ConclusionRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2ProblemRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2ProcessRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2DecisionsRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2TeamImpactRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2OutcomeRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy2RetroRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortSourceRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortNextRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortDesignRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortTestingRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortStatusRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudyCohortRetroRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3ProblemRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3WhySoloRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3StartRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3StickRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3ImpactRef = useRef<HTMLHeadingElement | null>(null);
  const caseStudy3RetroRef = useRef<HTMLHeadingElement | null>(null);

  const [expandedCases, setExpandedCases] = useState<boolean[]>(
      () => Array(CASE_STUDY_COUNT).fill(false)
  );

  // Normal document flow, so a nav click just scrolls the targeted section into view (no
  // page-offset math needed). The drift-effect sections reuse their drift ref as the nav
  // target; Bye has no drift (speed 0), so it gets its own plain ref.
  const introDrift = useRef<HTMLDivElement>(null);
  const aboutDrift = useRef<HTMLDivElement>(null);
  const projectsTitleDrift = useRef<HTMLDivElement>(null);
  const projectsCardsDrift = useRef<HTMLDivElement>(null);
  const educationDrift = useRef<HTMLDivElement>(null);
  const byeRef = useRef<HTMLDivElement>(null);

  // Anchor for the scroll-on-close below: each case's toggle button/container, so closing
  // can keep the button roughly where it already was on screen instead of recentering on
  // the whole (now much shorter) section.
  const caseToggleRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Animating grid-template-rows straight to 1fr forces the browser to keep re-measuring
  // the article's intrinsic content height on every animation frame, which is what made
  // the expand/collapse feel laggy on long case studies. Measuring the content height once
  // up front and transitioning to that fixed pixel value (via --case-height) avoids the
  // per-frame remeasurement.
  const caseDetailsRefs = useRef<Array<HTMLDivElement | null>>([]);
  const caseDetailsInnerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggleCase = (i: number) => {
    const wasOpen = expandedCases[i];
    if (!wasOpen) {
      const outer = caseDetailsRefs.current[i];
      const inner = caseDetailsInnerRefs.current[i];
      if (outer && inner) {
        outer.style.setProperty('--case-height', `${inner.scrollHeight}px`);
      }
    }
    setExpandedCases(prev => prev.map((v, idx) => (idx === i ? !v : v)));
    // Closing collapses a potentially long article back down, which otherwise strands
    // the viewport wherever it happened to be scrolled. Anchor on the toggle button itself
    // (block: 'end' keeps it at the bottom of the viewport, close to where it already sat
    // while sticky) rather than recentering the whole section, so the screen doesn't jump
    // to the case's title -- it stays roughly where the reader already was. Waiting for the
    // actual transitionend (rather than a fixed delay guessing at .case-details' 0.5s
    // grid-template-rows transition in app.scss) avoids scrolling to a stale, pre-collapse
    // position if the browser takes a touch longer to settle.
    if (wasOpen) {
      const detailsEl = caseDetailsRefs.current[i];
      const scrollToButton = (e?: TransitionEvent) => {
        if (e && e.propertyName !== 'grid-template-rows') return;
        detailsEl?.removeEventListener('transitionend', scrollToButton);
        caseToggleRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      };
      if (detailsEl) {
        detailsEl.addEventListener('transitionend', scrollToButton);
      } else {
        scrollToButton();
      }
    }
  };


  const textEnter = () => setCursorVariant('text')
  const linkEnter = () => setCursorVariant('link')
  const textLeave = () => setCursorVariant('default')

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    cursorOffsetRef.current = CURSOR_HALF_SIZE[cursorVariant] ?? CURSOR_HALF_SIZE.default;
  }, [cursorVariant]);

  useEffect(() => {
    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const updateIsTouchDevice = () => setIsTouchDevice(touchQuery.matches || hasTouchSupport);

    updateIsTouchDevice();
    touchQuery.addEventListener('change', updateIsTouchDevice);
    return () => touchQuery.removeEventListener('change', updateIsTouchDevice);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    // Position the cursor dot directly via motion values instead of React state, so
    // tracking the mouse doesn't re-render the whole (large) App tree on every pixel
    // of movement -- that was the source of the visible lag/jank.
    const mouseMove = (e: { clientX: number; clientY: number; }) => {
      rawCursorX.set(e.clientX - cursorOffsetRef.current);
      rawCursorY.set(e.clientY - cursorOffsetRef.current);
    };

    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [rawCursorX, rawCursorY, isTouchDevice]);

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
      backgroundColor: 'rgb(0, 0, 0)',
      mixBlendMode: 'normal',
      display: 'block',
    },
    text: {
      height: 100,
      width: 100,
      backgroundColor: 'rgb(255, 255, 255)',
      mixBlendMode: 'difference',
      display: 'block',
    },
    link: {
      height: 100,
      width: 100,
      backgroundColor: 'rgb(0, 0, 0)',
      mixBlendMode: 'normal',
      display: window.innerWidth <= 1048 ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      color: 'rgb(255, 255, 255)', // Text color
      fontSize: '12px',
    },
    iconWithText: {
      height: 50, // adjust size as needed
      width: 50,  // adjust size as needed
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
      mixBlendMode: 'normal',
      color: 'rgb(255, 255, 255)', // text color
      display: window.innerWidth <= 1048 ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%', // optional, for rounded corners
      // Add any additional styling as needed
    }
  };

  const [isOpen, setIsOpen ] = useState(false);

  function handleNav(target: React.RefObject<HTMLElement>) {
    target.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsOpen(false)
  }

  // @ts-ignore
    return (
      <>
        {!isTouchDevice && (
            <motion.div
                className='cursor'
                variants={cursorVariants}
                animate={cursorVariant}
                style={{
                  position: 'fixed',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  x: cursorX,
                  y: cursorY,
                }}
            >
              {cursorVariant === 'link' && (
                  <span>Click Here</span> // Text displayed when in 'link' state
              )} </motion.div>
        )}
        <ContactMeComponent linkEnter={linkEnter} textLeave={textLeave}/>

        <header className="glassmorphism">
          <span className="span-btn" key={4} onMouseEnter={textEnter} onMouseLeave={textLeave}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Olha Balahush</span>
          <button
              className="hamburger-menu"
              onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
                style={{backgroundColor: "black", height: "2px", width: "100%", borderRadius: "1px"}}
                animate={{rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0}}
                transition={{duration: 0.3}}
            />
            <motion.div
                style={{backgroundColor: "black", height: "2px", width: "100%", borderRadius: "1px"}}
                animate={{opacity: isOpen ? 0 : 1}}
                transition={{duration: 0.3}}
            />
            <motion.div
                style={{backgroundColor: "black", height: "2px", width: "100%", borderRadius: "1px"}}
                animate={{rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0}}
                transition={{duration: 0.3}}
            />
          </button>
          <div className="navs-container">
            <span className="span-btn" key={0} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => aboutDrift.current?.scrollIntoView({behavior: 'smooth', block: 'center'})}>About</span>
            <span className="span-btn" key={1} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => projectsTitleDrift.current?.scrollIntoView({behavior: 'smooth', block: 'center'})}>Projects</span>
            <span className="span-btn" key={2} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => educationDrift.current?.scrollIntoView({behavior: 'smooth', block: 'center'})}>Education</span>
            <span className="span-btn" key={3} onMouseEnter={textEnter} onMouseLeave={textLeave}
                  onClick={() => byeRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})}>Contact</span>
          </div>
        </header>

        {isOpen && (
            <motion.div
                className="glassmorphism adopted-nav-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "fixed",
                  top: "60px",
                  right: "5%",
                  width: "160px",
                  borderRadius: "0.25rem",
                  padding: "1rem"
                }}
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
            >
                <span className="span-btn" key={0} onMouseEnter={textEnter} onMouseLeave={textLeave}
                      onClick={() => handleNav(aboutDrift)}>About</span>
              <span className="span-btn" key={1} onMouseEnter={textEnter} onMouseLeave={textLeave}
                    onClick={() => handleNav(projectsTitleDrift)}>Projects</span>
              <span className="span-btn" key={2} onMouseEnter={textEnter} onMouseLeave={textLeave}
                    onClick={() => handleNav(educationDrift)}>Education</span>
              <span className="span-btn" key={3} onMouseEnter={textEnter} onMouseLeave={textLeave}
                    onClick={() => handleNav(byeRef)}>Contact</span>
            </motion.div>
        )}

        <div className='App'>
          <div className="scroll-page">
            <div ref={introDrift}>
              <IntroComponent textEnter={textEnter} textLeave={textLeave}/>
            </div>

            <div className="page ux-cases-page section-min-height" ref={aboutDrift}>
              <h1 onMouseEnter={textEnter} onMouseLeave={textLeave}>About</h1>
              <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Product Designer & Engineer with over 2 years of experience in a startup environment. I dig into the user's problem from different angles, brainstorm with cross-functional teams to choose the strongest solution, then experiment fast to learn and iterate. Alongside that, I build design systems that save teams time and keep the product consistent.</p>
              <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>Current Focus</h5>
              <div className="horizontal-line"></div>
              <p onMouseEnter={textEnter} onMouseLeave={textLeave}>I'm currently working on rethinking the cohort overview for admins on a peer-to-peer studying platform, a project that started with a vague NPS complaint about complexity. I took the initiative to shadow clients directly, which turned that vague signal into much clearer information architecture and usability issues. One stood out: admins couldn't tell how a cohort was doing without guessing their way through the curriculum structure. The redesign and first round of usability testing are complete, and the team is now iterating toward MVP.</p>
            </div>

            <div className="page ux-cases-page section-min-height" ref={projectsTitleDrift}>
                <h1 onMouseEnter={textEnter} onMouseLeave={textLeave} className='title'>Projects</h1>
                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>Case studies</h5>
                <div className="horizontal-line"></div>
                <div className="row" style={{marginTop: '4rem'}}>
                  <h1 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>01</h1>
                  <div className=""></div>
                  <div className="title-container">
                  <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>Redesigning school policy management</h2>
                    <div className="btns-container">
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>Overview
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>The problem
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>The process
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>Key decisions
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>Team impact
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>Outcome
                  </span>
                  <span className="span-tag" onMouseEnter={textEnter} onMouseLeave={textLeave}>Retrospective
                  </span>
                </div>
                  </div>
                </div>
                <div className="pic-container prev">
                    <img src={`${process.env.PUBLIC_URL + '/policy-preview.png'}`} alt="Overview of inconsistencies across the product before the design system was introduced"></img>
                </div>

                  <p onMouseEnter={textEnter} onMouseLeave={textLeave}>A roadmap item that read like a simple feature
                    request ended up costing three months of work once it shipped and failed with both students and
                    admins. Going back to an older, recurring complaint, I skipped building from the request as written
                    and instead mapped out real client quotes to find what was actually going on. From there, I ran
                    research, a brainstorming session, and with the team we shipped an MVP that cut down the manual
                    work admins were doing.</p>

                <div className={`case-details ${expandedCases[0] ? 'is-open' : ''}`} ref={el => { caseDetailsRefs.current[0] = el; }}>
                <div className="case-fade"></div>
                <div className="case-details-inner" ref={el => { caseDetailsInnerRefs.current[0] = el; }}>

                <h4 ref={caseStudy2ProblemRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What problem did we face?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>During my 2 years work at the startup, we once
                  got a new client and it was agreed with them on a signed roadmap. The last point, which was not
                  discussed ahead much, was clearly the previous solution they'd used for years with a different
                  product. Since we had a contractual deadline, the team decided to go with the provided solution:
                  personal deadlines for each student that would automatically postpone every time one was missed,
                  paired with a pacing system meant to flag cohort health based on that. After quick design and a
                  couple of rounds of usability testing with clients, it went into hard development for almost 3
                  months, and once it got published, it faced issues straight away from both clients and platform
                  users, students complained it was misaligned with communication from the school, and admins said
                  it wasn't actually identifying the health of the batch or fulfilling their needs.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/pacing.png'}`} alt="Pacing system screen showing student deadlines extending day by day"></img>
                </div>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>At this screen you can see how the pacing system
                  was implemented, highlighting students whose deadline was extending, day by day, letting them hang
                  out on tasks as long as possible.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/pacing-student.png'}`} alt="Student view of the pacing system showing time left and deadline extensions"></img>
                </div>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>At the students' view, they could see how much
                  time was left on the current assignment and encouraging points that could be received by completing
                  on time, otherwise the user could still do it and all forward deadlines would extend. Following
                  tasks had days instead. That was fully against communication from school staff, as the school had
                  deadlines instead of days, but that's something that came out later.</p>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>What happened next? At that point, we decided to
                  prioritize another problem we'd already been hearing about for quite some time, one that, looking
                  back, was really the same territory we'd just gotten wrong: individual deadline flexibility, and
                  actually knowing how a cohort was doing. So we came back to the old problem, which sounded
                  like:</p>

                <blockquote onMouseEnter={textEnter} onMouseLeave={textLeave}>The current system only allows global
                  extensions for all students in a module, making it impossible to grant extensions on an individual
                  basis. This leads to unfairness, as students who don't need extra time also get an unnecessary
                  extension, which may reduce motivation and cause inconsistencies in the learning process.
                </blockquote>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Reading it, I was so confused, how can we even
                  work with a statement that clearly states we should make it possible to grant extensions on an
                  individual basis, right?</p>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>But what's the actual problem?</h5>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>That's when I took the time to gather all the
                  quotes I had on this topic from our clients, and mapped out the following statement:</p>

                <blockquote onMouseEnter={textEnter} onMouseLeave={textLeave}>As an admin, I need every student to
                  know exactly where they stand, how many strikes they have, whether their extension is still valid,
                  when they move to a paid plan, or other policy restrictions. But that information only exists in a
                  tracking system I maintain myself, outside the product. So I end up being the one students call when
                  they're confused.
                </blockquote>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>This taught me the real value of a strong
                  problem statement: rather than jumping straight to a solution, it opens up a much wider space of
                  possible solutions. That breadth is what leads to a better outcome, not just any solution, but the
                  best one.</p>

                <h4 ref={caseStudy2ProcessRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What did solving it actually involve?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>From there, I led the project end to end, as was
                  agreed upon with the team. I started by auditing the existing research and all the client quotes we
                  had, which is basically how I built the real problem statement in the first place. From there I ran
                  targeted follow-up conversations to close whatever research gaps were still open. Once I had that,
                  I planned and ran a brainstorming session using the Opportunity Solution Tree framework, mainly to
                  force us to structure solution options against the reframed problem, instead of jumping straight
                  into UI like we normally would've. I designed the solutions that came out of that, ran usability
                  testing directly with clients, and made fast UI iterations based on whatever came back once it was
                  live. After launch, I ran a follow-up round of qualitative research to figure out what the next
                  iteration should actually focus on.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Engineering and the PM were involved throughout,
                  and those collaboration points helped untangle the gray zones the most. So this wasn't solved in
                  isolation, but the research direction, the problem framing, the design decisions, and the frontend
                  implementation were mine to drive.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/extensions-brainstorming.png'}`} alt="Opportunity Solution Tree brainstorming session mapping the extensions and warnings problem"></img>
                </div>

                <h4 ref={caseStudy2DecisionsRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What decisions did we make along the way?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Two moments in the design process stand out,
                  because we didn't get them right the first time.</p>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>The warning icon</h5>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Students who'd broken a school rule needed to
                  see that clearly, it directly affected what they had to decide next. The first version put a
                  prominent warning icon at the top of the dashboard, next to their other study information. It
                  tested fine functionally. But sitting with it longer, something felt off: seeing a hard warning
                  symbol every time you open the platform, possibly for weeks, has a real cost to a student's
                  wellbeing. The information still needed to live on the dashboard, we couldn't bury it, but the
                  visual weight was the actual problem, not the placement. We kept the location, swapped the icon for
                  a flag, and kept the word "warning" only where school policy specifically required that language.
                  Same information, same visibility, meaningfully less weight to carry around every day.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/warnings.png'}`} alt="Redesigned warning indicator shown as a flag instead of a warning icon"></img>
                </div>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>The notification channel</h5>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>We wanted students notified promptly when a
                  policy event affected them. The default assumption was a platform notification, until we noticed
                  that assumption only works if the student is actively on the platform, which, for a web app people
                  check a few times a week, isn't realistic. We switched to email instead: short, informative, stating
                  what happened and what to do if it looked like a mistake. It shipped as an MVP. Measuring open and
                  response rates, and iterating from there, was the obvious next step, one that landed just after my
                  time on the project ended.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/notifications.png'}`} alt="Email notification sent to a student about a policy event"></img>
                </div>

                <h4 ref={caseStudy2TeamImpactRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>How did this change the team?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Convincing the team to spend more time on
                  research, brainstorming, and clearly defining experiments and their measurement was definitely
                  worth it, especially in the AI era, when with good prompts and SRDs, everything can get written 10
                  times faster. What mattered most to me was that with clear, simple experiments, we learned fast and
                  iterated fast too. And to remind you, we were coming straight out of pure feature development, the
                  one that took around 3 months of work and went directly into the trash. That was an amazing
                  learning point for our process, even if we learned it the hard way.</p>

                <h4 ref={caseStudy2OutcomeRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What was the outcome?</h4>
                {/*  TODO improve copy*/}
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Clear warnings view for admins. System that supports cohort health, so admins can see flags on students who needs support or cannot be at school, cause of violations already. Actional in details view for each students for better picture of violations, and flexible management in case of any mistake</p>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/flags-outcome.png'}`} alt="Admin view of student warning flags and violation details"></img>
                </div>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Automatic extensions, that reduces admins manual work on providing and managing them manuall. Now along with extensions automated warnings send along so admin don't have to manage it, but they see overview at the same time. System that supports cohort health, so admins can see flags on students who needs support or cannot be at school, cause of violations already.</p>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/extensions-output.png'}`} alt="Admin view of automatic extension management with accompanying warnings"></img>
                </div>

                <ul onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>Time spent on manual maintenance came down, partially confirmed through quarterly NPS follow-up</li>
                  <li>Admins reduced the manual tracking system they'd been maintaining outside the product</li>
                  <li>Fewer students were confused about where they stood, measured by the number of requests
                    received by admins, since the information now lived in one place instead of being relayed by
                    hand</li>
                </ul>

                <h4 ref={caseStudy2RetroRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What would I do differently?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Two things stick with me looking back:</p>
                <ol onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <li>I'd approach any upcoming roadmap item critically right away, even when the deadline is tight,
                    it's always cheaper to start from the problem, even when the solution seems obvious or the tight
                    deadline makes it feel like overkill to question it. There are always multiple solutions to a
                    problem, and you only find the best one by seriously considering the others.</li>
                  <li>I'd also define success metrics and an iteration plan before shipping, not after. We measured
                    qualitatively and through NPS, but we never nailed down in advance what "done" or "working"
                    actually meant, that was left undefined for the team, and still unresolved when I left the
                    project.</li>
                </ol>
                </div>
                </div>
                <div className={`case-toggle-container ${expandedCases[0] ? 'is-sticky' : ''}`} ref={el => { caseToggleRefs.current[0] = el; }}>
                  <button className={`case-toggle-btn ${expandedCases[0] ? 'is-open' : ''}`} onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => toggleCase(0)}>
                    {expandedCases[0] ? 'Close case' : 'Read case'}
                  </button>
                </div>
              </div>

            <div className="page ux-cases-page">

                <div className="row" style={{marginTop: '4rem'}}>
                  <h1 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>02</h1>
                  <div className=""></div>
                    <div className="title-container">
                        <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>Redesigning the cohort information architecture</h2>
                        <div className="btns-container">
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Overview
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Where It Came From
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Prioritization
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Design Depths
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Testing
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Status
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Retrospective
                  </span>
                </div>
                    </div>
                </div>
                <div className="pic-container prev">
                    <img src={`${process.env.PUBLIC_URL + '/cohort-preview.png'}`} alt="Overview of inconsistencies across the product before the design system was introduced"></img>
                </div>
                  <p onMouseEnter={textEnter} onMouseLeave={textLeave}>NPS scores kept flagging that admins found the
                    platform too complicated to navigate and find information in. Looking for an answer to what exactly
                    was wrong just uncovered a gap in understanding admins' use cases, which turned out to be crucial
                    to support the flows properly. I ran shadowing sessions to find out, which surfaced much clearer
                    problems, one of them: admins couldn't tell how a cohort was actually doing without guessing their
                    way through the curriculum structure. I prioritized this as the biggest pain point noticed across
                    all clients, ran a first round of usability testing on a redesigned cohort overview, and the
                    project is continuing toward MVP development.</p>

                <div className={`case-details ${expandedCases[1] ? 'is-open' : ''}`} ref={el => { caseDetailsRefs.current[1] = el; }}>
                <div className="case-fade"></div>
                <div className="case-details-inner" ref={el => { caseDetailsInnerRefs.current[1] = el; }}>

                <h4 ref={caseStudyCohortSourceRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Where did the problem come from?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The starting signal was NPS. Admins kept saying
                  the platform felt complex and hard to navigate, a repeatable pattern, but a vague one. It didn't
                  tell us what part was confusing, or in which situations.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Rather than guess at what "complicated" meant, I
                  went and shadowed clients directly. Shadowing is the most reliable way to see how someone actually
                  uses a product, not how they describe using it. It also answered something we genuinely didn't have
                  an answer to:</p>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>What were admins actually trying to do on this platform, and why?</h5>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>A few days of shadowing turned up a lot, across a
                  lot of different topics. But one problem stood out clearly:</p>

                <blockquote onMouseEnter={textEnter} onMouseLeave={textLeave}><strong>When</strong> an admin needs to
                  know at a glance whether a cohort is on track or needs intervention, <strong>but</strong> they have
                  to guess their way through a curriculum structure that doesn't explain how curriculum items among
                  participants are connected, they struggle to check in on learners without navigating blind first,{' '}
                  <strong>which leads to</strong> manually cross-checking completion outside the product.
                </blockquote>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>One moment from shadowing made this concrete: an
                  admin spotted a learner still on a topic with a deadline two weeks out, from their experience,
                  that's clearly not enough time left to finish and review it, and wanted to step in right there.
                  That told us the real unit of information admins needed wasn't "a learner's progress" on its own, it
                  was the relationship between a study item, how many people were on it, and its deadline. The same
                  data had to answer the reverse case too: if most of the cohort is taking 10 days on something
                  scheduled for 5, that's a sign the deadline is wrong, not the students.</p>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The cohort health picture also had to include
                  people who'd normally get filtered out of a progress view entirely, anyone who'd dropped off or
                  was on leave, because knowing who to support, and how, depends on seeing the whole cohort, not just
                  the people actively moving through it.</p>

                <h4 ref={caseStudyCohortNextRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>But with all these insights, what did I do next?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Once I had this and the other issues from
                  shadowing mapped out, I sorted everything into two buckets: quick wins (for example, just
                  program-configuration restrictions, easy fixes) and bigger experiments, like this one. I
                  prioritized the cohort overview problem out of all of them, because it was both the most-used part
                  of the product and the biggest pain point admins had.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>To make that concrete: to answer something as
                  simple as "how is this learner doing," admins were clicking 10+ times, bouncing back and forth
                  across the screen while holding all the context in their head. At the same time it was hard to say
                  how the cohort was actually doing, the overview was just showing surface progress, so to get a
                  better picture of health, admins had to dig in and face many navigation steps.</p>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>How is the cohort actually doing?</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/cohort-current.png'}`} alt="Current admin flow for checking cohort progress, requiring many navigation steps"></img>
                </div>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>To conclude in total I made at least 13 clicks. And this module was the easy case, since the deadline had already passed, so I didn't need to dig into individual topics like the admin do. For them, managing cohort health takes over 50 clicks. This one use case makes the scale of the navigation and architecture problem obvious.</p>

                <h4 ref={caseStudyCohortDesignRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Design depths</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>I deliberately started from a blank view, not the
                  current design, just the admin's actual need, so I wasn't anchored to what already existed.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The biggest open decision was what the overview
                  should be built around: curriculum structure, or participants. I looked at how clients' other
                  platforms (the "3rd platform" tools they referenced) handled this, which was useful for seeing how
                  they prioritized information. Most leaned toward a high-level curriculum view first, with modules
                  shown as columns.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>A second decision was harder to resolve cleanly:
                  schools use two different deadline systems, some granular, some general, and that changes what
                  level of detail the participant view actually needs. I worked through this by going back to the
                  original use case, tracking learners over time, and realized the right level of detail depends on
                  which topic a participant is currently on. So instead of forcing one fixed format, that had to stay
                  flexible.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/3rd-platform-johvi.png'}`} alt="Reference screenshot of a third-party platform's cohort overview module"></img>
                </div>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/design-cohort-1.png'}`} alt="First blank-slate version of the redesigned cohort overview"></img>
                </div>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/design-cohort-1.1.png'}`} alt="First version of the redesigned cohort overview, alternate view"></img>
                </div>

                <h4 ref={caseStudyCohortTestingRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What did the first round of testing tell us?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Since the project's still active, only one round
                  of usability testing has happened so far, moderated sessions where I asked admins to walk through
                  the exact use cases they'd described earlier: checking cohort health, spotting who's falling
                  behind, deciding if a deadline needed to change, plus open time to explore on their own.</p>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>That round surfaced two clear issues: the student
                  list included information that was confusing or just unnecessary, and the curriculum settings were
                  hard to make sense of as they stood. Click count also came out of this as a success metric worth
                  tracking going forward, a direct, measurable stand-in for the original "10+ clicks" complaint.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Based on that, I iterated into an improved
                  version.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/design-cohort-2.png'}`} alt="Improved cohort overview design after the first round of usability testing"></img>
                </div>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/design-cohort-2.1.png'}`} alt="Improved cohort overview design, alternate view"></img>
                </div>
                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/design-cohort-2.2.png'}`} alt="Improved cohort overview design, additional view"></img>
                </div>

                <h4 ref={caseStudyCohortStatusRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Where this stands now</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The project hasn't reached development yet. Most
                  of the collaboration so far has been in research and validation, working closely with clients
                  through usability testing. Given what this project actually needs (a real information-architecture
                  rework, not a surface tweak), research and design were always going to be the longest phases, and
                  that's held true so far.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Next steps: keep validating, and move the current
                  direction into an MVP.</p>

                <h4 ref={caseStudyCohortRetroRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What would I do differently?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>I'd validate earlier. I spent more time than I
                  needed polishing the design before the first round of testing, testing sooner would have surfaced
                  the same issues faster, with less invested in a direction before I knew whether it was right.</p>
                </div>
                </div>
                <div className={`case-toggle-container ${expandedCases[1] ? 'is-sticky' : ''}`} ref={el => { caseToggleRefs.current[1] = el; }}>
                  <button className={`case-toggle-btn ${expandedCases[1] ? 'is-open' : ''}`} onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => toggleCase(1)}>
                    {expandedCases[1] ? 'Close case' : 'Read case'}
                  </button>
                </div>
              </div>

            <div className="page ux-cases-page">

                <div className="row" style={{marginTop: '4rem'}}>
                  <h1 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>03</h1>
                  <div className=""></div>
                    <div className="title-container">
                        <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>Building a design system for a long-living product</h2>
                <div className="btns-container">
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Overview
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>The Problem
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Why Solo
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Where I Started
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Making It Stick
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Team & Product Impact
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Retrospective
                  </span>
                </div>
                    </div>
                </div>
                <div className="pic-container prev">
                    <img src={`${process.env.PUBLIC_URL + '/ds-overview.png'}`} alt="Overview of inconsistencies across the product before the design system was introduced"></img>
                </div>

                  <p onMouseEnter={textEnter} onMouseLeave={textLeave}>By the time a design system landed on my plate, the product had been growing without one for
                    close to 3 years, colors, shades, buttons, layout patterns, even something as basic as when to
                    show a confirmation step were all inconsistent depending on who built what and when. I audited the
                    whole platform alone, rebuilt it from tokens up, and, the part I'm most proud of, turned the
                    system into an automated check inside the codebase itself, so it didn't just sit in Figma waiting
                    to be ignored.</p>

                <div className={`case-details ${expandedCases[2] ? 'is-open' : ''}`} ref={el => { caseDetailsRefs.current[2] = el; }}>
                <div className="case-fade"></div>
                <div className="case-details-inner" ref={el => { caseDetailsInnerRefs.current[2] = el; }}>

                {/*<div className="pic-container full">*/}
                {/*    <img src={`${process.env.PUBLIC_URL + '/ds-overview.png'}`} alt="Overview of inconsistencies across the product before the design system was introduced"></img>*/}
                {/*</div>*/}

                <h4 ref={caseStudy3ProblemRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What was going on for 3 years?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>3 years is a long time for a product to grow
                  without a shared visual language. It showed up everywhere, not just in colors, but in the shades of
                  the same color, in how buttons were styled, in layout placement, in when a confirmation step
                  appeared and when it didn't. None of this was anyone's fault exactly, it's what happens by default
                  when decisions get made feature by feature with no one owning consistency across all of them. But it
                  was visible enough, to enough people, that it had already become an acknowledged problem well before
                  it landed with me.</p>

                <h4 ref={caseStudy3WhySoloRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Why did I take this on alone, and push so hard on it?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>I ended up owning this entirely on my own, as a
                  side effort I then prioritized above everything else for a full month to actually ship it and get
                  it in use, rather than let it become another thing that's permanently "in progress." That
                  prioritization was deliberate: a design system isn't a cleanup job, it's infrastructure. Every
                  inconsistency it removed was inconsistency the whole platform would otherwise keep accumulating,
                  and every rule it established was one less thing every future feature would need to re-decide from
                  scratch.</p>

                <h4 ref={caseStudy3StartRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Where did I start, and why?</h4>

                 <div className="pic-container full">
                  <img src={`${process.env.PUBLIC_URL + '/ds-strategy.png'}`} alt="Prioritization strategy for auditing the platform's design inconsistencies"></img>
                </div>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>I went through the entire platform first,
                  cataloguing what actually existed, every token, every component, every recurring pattern. Rather
                  than starting with whatever looked messiest, I prioritized based on where the inconsistency was
                  doing the most damage.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Tokens came first. Some existing colors were
                  failing contrast ratio checks, a real accessibility problem, not a cosmetic one. Separately, as the
                  platform brought on more clients, the existing secondary color turned out not to work with
                  white-labeling, it couldn't flex to different client branding the way it needed to. Fixing tokens
                  wasn't the interesting part of the project, but it was the part everything else depended on.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/tokens-colors.png'}`} alt="Before-and-after comparison of the audited color tokens and contrast fixes"></img>
                </div>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Once tokens were settled and published, I moved
                  to components, applying the same process. For each item, I worked two tracks
                  in parallel, updating it properly in Figma, and encoding the rule as a skill in the codebase, then
                  running that skill against the live codebase to surface every place the old, inconsistent version
                  was still in use.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/ds-struct.png'}`} alt="Structure of the design system's component library in Figma"></img>
                </div>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Some of the messier inconsistencies weren't just
                  "different styles", they were flat-out duplicate components doing the same job in slightly
                  different ways, which I unified rather than just standardizing each in place.</p>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Look for some examples here: <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link' href='https://www.figma.com/proto/E4j6oS9iXeNw8rNOI0gydu/CV?page-id=2050%3A234&node-id=2109-38078&viewport=-850%2C62%2C0.07&t=OwXLQlFgrdPq21y8-9&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2109%3A38078&show-proto-sidebar=1' target='_blank' rel='noopener noreferrer'>Components.Buttons</a>, <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link' href='https://www.figma.com/proto/E4j6oS9iXeNw8rNOI0gydu/CV?page-id=2050%3A234&node-id=2053-10603&viewport=-850%2C62%2C0.07&t=OwXLQlFgrdPq21y8-9&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2053%3A10603&show-proto-sidebar=1' target='_blank' rel='noopener noreferrer'>Patterns.NavigationBar</a>, <a onMouseEnter={linkEnter} onMouseLeave={textLeave} className='link' href='https://www.figma.com/proto/E4j6oS9iXeNw8rNOI0gydu/CV?page-id=2050%3A234&node-id=2053-13850&viewport=-850%2C62%2C0.07&t=OwXLQlFgrdPq21y8-9&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=2053%3A13850&show-proto-sidebar=1' target='_blank' rel='noopener noreferrer'>Pattern.ResizableCard</a></p>

                <h4 ref={caseStudy3StickRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>How did I make the design system useful straight away?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>This is the part I think mattered most. The
                  design system didn't stay a documentation exercise. By converting it into skills embedded in code
                  review, it started actively catching wrong usage, flagging it automatically the moment a developer
                  touched something small, long before it would've reached a designer's eyes, if it ever would have at
                  all. A design system nobody enforces is just a suggestion; this one had teeth.</p>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/claude-skills.png'}`} alt="Code review flagging incorrect design system usage via an automated skill"></img>
                </div>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>It also changed what building something new
                  actually felt like. Once the core pieces existed and were enforced, most new design work stopped
                  being "design from nothing" and started being closer to assembling from existing, trusted pieces,
                  lego, basically, except for the genuinely new parts that had no precedent in the system yet. That's
                  a very different, much faster kind of design work.</p>

                <h4 ref={caseStudy3ImpactRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>How did it impact team work & the product?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Every time a new rule went into the codebase,
                  developers actually used it, and pushed back or suggested improvements based on what they ran into
                  in practice. That feedback loop is what kept the system from calcifying into a document nobody
                  trusted, it stayed something people used and helped shape, not a spec handed down once and left to
                  rot.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Before this, engineers had two options when they
                  weren't sure what to use: come find me and double-check, the best-case outcome, or just guess, and
                  quietly add more inconsistency to the platform. Neither path scaled. Afterward, that ambiguity
                  mostly disappeared, since the answer was enforced in the tooling itself rather than living in one
                  designer's head.</p>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The other clear impact was on my own time: less
                  of it went into redesigning or reworking existing flows and views, since most of what previously
                  caused rework, inconsistent components, ambiguous patterns, had already been resolved at the
                  system level.</p>

                <h4 ref={caseStudy3RetroRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>What would I do differently?</h4>
                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>If I could choose, I'd build the design system
                  alongside a product from day one, and grow it as needed, rather than retrofitting one onto three
                  years of accumulated decisions after the fact. Building from scratch and populating on demand is a
                  fundamentally different, much cheaper problem than untangling and standardizing years of
                  inconsistency after it's already baked into a live product used by real clients.</p>
                </div>
                </div>
                <div className={`case-toggle-container ${expandedCases[2] ? 'is-sticky' : ''}`} ref={el => { caseToggleRefs.current[2] = el; }}>
                  <button className={`case-toggle-btn ${expandedCases[2] ? 'is-open' : ''}`} onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => toggleCase(2)}>
                    {expandedCases[2] ? 'Close case' : 'Read case'}
                  </button>
                </div>
              </div>

            <div className="page ux-cases-page">
                <div className="row" style={{marginTop: '4rem'}}>
                  <h1 className='pr-num' onMouseEnter={textEnter} onMouseLeave={textLeave}>04</h1>
                  <div className=""></div>
                    <div className="title-container">
                  <h2 onMouseEnter={textEnter} onMouseLeave={textLeave}>Integration of community into the hybrid peer-to-peer studying platform</h2>

                <div className="btns-container">
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Research Phase
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Ideation & Solution Design
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Prototyping & Testing
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>MVP Launch – Fake Door Experiment
                  </span>
                  <span className="span-btn" onMouseEnter={textEnter} onMouseLeave={textLeave}>Conclusion & Impact
                  </span>
                </div>
                </div>
                </div>

                <div className="pic-container prev">
                <img src={`${process.env.PUBLIC_URL + '/community.png'}`} alt="Community feature integrated into the hybrid peer-to-peer studying platform"></img>
                </div>

                  <p onMouseEnter={textEnter} onMouseLeave={textLeave}>The goal of this research was to understand what causes a lack of motivation in students, as
                    inactivity
                    was a major issue observed on the platform.
                    Through secondary research, I analyzed existing studies and research papers related to student
                    engagement, motivation, and online learning behavior. This helped me identify key themes and gaps
                    that
                    required further exploration through user interviews</p>

                <div className={`case-details ${expandedCases[3] ? 'is-open' : ''}`} ref={el => { caseDetailsRefs.current[3] = el; }}>
                <div className="case-fade"></div>
                <div className="case-details-inner" ref={el => { caseDetailsInnerRefs.current[3] = el; }}>

                <h5 onMouseEnter={textEnter} onMouseLeave={textLeave}>User Interviews</h5>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/UR-summary.png'}`} alt="Summary of findings from student user interviews"></img>
                </div>

                <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Objective</h6>
                <div>
                  <p>The user interviews were designed to:</p>
                  <ul>
                    <li>Gain insights into students' study experiences</li>
                    <li>Understand what motivates students</li>
                    <li>Identify the obstacles students face while studying</li>
                    <li>Uncover key pain points</li>
                    <li>Validate assumptions about user personas</li>
                  </ul>
                </div>
                </div>

                <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Methodology</h6>
                  <p>A semi-structured interview format was chosen, allowing flexibility to explore deeper insights into
                    students’ pain points and motivations</p>
                </div>

                <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Key Findings</h6>
                  <p>After conducting user interviews, the most prominent pain point emerged:
                    <br></br>
                    Lack of community feeling among students—Many students felt isolated in their learning journey,
                    which
                    negatively impacted motivation and engagement</p>
                </div>

                <h4 ref={caseStudy1IdeationRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Ideation & Solution Design</h4>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/brainstorming.png'}`} alt="Brainstorming session notes for the community feature ideation"></img>
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

                <h4 ref={caseStudy1PrototypingRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Prototyping & Testing</h4>

                <p onMouseEnter={textEnter} onMouseLeave={textLeave}>Before developing a full-fledged solution, I
                  created low-fidelity wireframes to map out the key
                  user
                  flows and interactions. After iterating based on internal feedback, I refined them into
                  high-fidelity
                  prototypes for usability testing</p>

                <div className="pic-container full">
                  <img src={`${process.env.PUBLIC_URL + '/testing.png'}`} alt="High-fidelity prototype used for usability testing"></img>
                </div>

                <div className="" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h6>Usability Testing</h6>
                  <p>A moderated usability test with real users was conducted to validate design choices. Key takeaways
                    included:</p>
                  <ul>
                    <li>A clearer user onboarding process for the new feature</li>
                    <li>More intuitive navigation for finding study partners</li>
                    <li>Better integration of the community aspect within the platform</li>
                  </ul>
                </div>

                <h4 ref={caseStudy1MvpRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>MVP Launch – Fake Door Experiment</h4>

                <div className="pic-container">
                  <img src={`${process.env.PUBLIC_URL + '/fake-door.png'}`} alt="Fake door test screen for the teammate search feature"></img>
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

                <h4 ref={caseStudy1ConclusionRef} onMouseEnter={textEnter} onMouseLeave={textLeave}>Conclusion & Impact</h4>

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
                </div>
                <div className={`case-toggle-container ${expandedCases[3] ? 'is-sticky' : ''}`} ref={el => { caseToggleRefs.current[3] = el; }}>
                  <button className={`case-toggle-btn ${expandedCases[3] ? 'is-open' : ''}`} onMouseEnter={linkEnter} onMouseLeave={textLeave}
                          onClick={() => toggleCase(3)}>
                    {expandedCases[3] ? 'Close case' : 'Read case'}
                  </button>
                </div>
              </div>

            <div ref={projectsCardsDrift}>
              <ProjectsComponent textEnter={textEnter} linkEnter={linkEnter} textLeave={textLeave}/>
            </div>

            <div ref={educationDrift}>
              <EducationComponent textEnter={textEnter} textLeave={textLeave}/>
            </div>

            <div ref={byeRef}>
              <ByeComponent textEnter={textEnter} textLeave={textLeave}/>
            </div>

          </div>
        </div>
      </>
  );
}

export default App;
