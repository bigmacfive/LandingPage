import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import './index.css'; // CSS 파일 임포트

const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [fontSize, setFontSize] = useState(16);
  const [email, setEmail] = useState('');
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
      setFontSize(Math.max(12, Math.min(16, window.innerWidth / 50)));
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    engineRef.current = Engine.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: 'black'
      }
    });

    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: '#060a19' } });
    const text = Bodies.rectangle(400, 300, 600, 100, {
      isStatic: true,
      render: {
        fillStyle: 'white',
        text: {
          content: 'THE SCENTS',
          color: 'white',
          size: 80,
          family: "'IBM Plex Mono', monospace"
        }
      }
    });

    const pentagon = Bodies.polygon(300, 100, 5, 50);
    const rectangle = Bodies.rectangle(500, 100, 100, 50);
    const circle = Bodies.circle(400, 100, 30);
    const square = Bodies.rectangle(200, 100, 50, 50);

    Composite.add(engineRef.current.world, [ground, text, pentagon, rectangle, circle, square]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engineRef.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engineRef.current.world, mouseConstraint);
    render.mouse = mouse;

    Matter.Runner.run(engineRef.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      Engine.clear(engineRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      gap: '0.5rem',
    },
    title: {
      fontSize: `${fontSize}px`,
      fontWeight: 'bold',
      padding: '0.5rem',
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '8px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    },
    nav: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
      borderRadius: '8px',
      height: '40px',
      overflow: 'hidden',
      flexGrow: 1,
    },
    navItem: {
      padding: '0 1rem',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    applyButton: {
      padding: '0 1rem',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      height: '40px',
      fontSize: `${fontSize}px`,
      whiteSpace: 'nowrap',
    },
    main: {
      height: 'calc(100vh - 60px)',
      marginTop: '0.5rem',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    teamIntro: {
      backgroundColor: '#FFC0CB',
      padding: '2rem',
      marginTop: '0.5rem',
      borderRadius: '8px',
    },
    teamTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    teamDescription: {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    emailForm: {
      backgroundColor: 'black',
      color: 'white',
      padding: '2rem',
      marginTop: '0.5rem',
      borderRadius: '8px',
      textAlign: 'center',
    },
    emailInput: {
      width: '100%',
      maxWidth: '400px',
      padding: '0.5rem',
      marginRight: '0.5rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: 'black',
      color: 'white',
    },
    emailButton: {
      padding: '0.5rem 1rem',
      backgroundColor: 'white',
      color: 'black',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    featuresSection: {
      backgroundColor: '#f0f0f0',
      padding: '2rem',
      marginTop: '0.5rem',
      borderRadius: '8px',
    },
    feature: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    featureDescription: {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    developerReviews: {
      backgroundColor: 'black',
      color: 'white',
      padding: '2rem',
      marginTop: '0.5rem',
      borderRadius: '8px',
      textAlign: 'center',
    },
    reviewsTitle: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    reviewsSubtitle: {
      fontSize: '1rem',
      marginBottom: '2rem',
    },
    reviewsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
    },
    reviewCard: {
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'left',
    },
    reviewProfile: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    reviewAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '1rem',
      backgroundColor: '#ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#333',
    },
    reviewText: {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
  };

  return (
    <div className="container">
      <div style={styles.header}>
        <div style={styles.title}>THE SCENTS</div>
        <nav style={styles.nav}>
          <div style={styles.navItem}>Home</div>
          <div style={styles.navItem}>Features</div>
          <div style={styles.navItem}>Reviews</div>
          <div style={styles.navItem}>Contact</div>
        </nav>
        <button style={styles.applyButton}>Apply Now</button>
      </div>
      <div style={styles.main} ref={sceneRef}></div>
      <div style={styles.teamIntro}>
        <div style={styles.teamTitle}>Meet Our Team</div>
        <div style={styles.teamDescription}>
          Our team consists of experienced professionals who are passionate about bringing you the best experience.
        </div>
      </div>
      <div style={styles.emailForm}>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.emailInput}
            required
          />
          <button type="submit" style={styles.emailButton}>Subscribe</button>
        </form>
      </div>
      <div style={styles.featuresSection}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>⭐</div>
          <div style={styles.featureTitle}>Feature 1</div>
          <div style={styles.featureDescription}>Description of feature 1.</div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🚀</div>
          <div style={styles.featureTitle}>Feature 2</div>
          <div style={styles.featureDescription}>Description of feature 2.</div>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>💎</div>
          <div style={styles.featureTitle}>Feature 3</div>
          <div style={styles.featureDescription}>Description of feature 3.</div>
        </div>
      </div>
      <div style={styles.developerReviews}>
        <div style={styles.reviewsTitle}>What Developers Say</div>
        <div style={styles.reviewsSubtitle}>Here are some reviews from our developers.</div>
        <div style={styles.reviewsGrid}>
          <div style={styles.reviewCard}>
            <div style={styles.reviewProfile}>
              <div style={styles.reviewAvatar}>A</div>
              <div>Alex</div>
            </div>
            <div style={styles.reviewText}>
              "This tool is fantastic for rapid development and testing."
            </div>
          </div>
          <div style={styles.reviewCard}>
            <div style={styles.reviewProfile}>
              <div style={styles.reviewAvatar}>B</div>
              <div>Ben</div>
            </div>
            <div style={styles.reviewText}>
              "A must-have for every developer's toolkit."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
