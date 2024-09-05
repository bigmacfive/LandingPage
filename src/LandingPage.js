import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';

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
    container: {
      fontFamily: "'IBM Plex Mono', monospace",
      letterSpacing: '-0.05em',
      backgroundColor: 'white',
      padding: '0.5rem',
    },
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
    },
    reviewName: {
      fontWeight: 'bold',
    },
    reviewPosition: {
      fontSize: '0.9rem',
      color: '#666',
    },
    reviewText: {
      fontSize: '0.9rem',
      lineHeight: '1.4',
    },
    footer: {
      backgroundColor: 'black',
      color: 'white',
      padding: '2rem',
      marginTop: '0.5rem',
      borderRadius: '8px',
    },
    footerContent: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
    },
    footerLogo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: isMobile ? '1rem' : 0,
    },
    footerLinks: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      marginBottom: isMobile ? '1rem' : 0,
    },
    footerLink: {
      color: 'white',
      textDecoration: 'none',
    },
    footerEmail: {
      marginBottom: isMobile ? '1rem' : 0,
    },
    footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      borderTop: '1px solid #333',
      paddingTop: '1rem',
    },
  };

  const reviews = [
    {
      name: "Johannes Schickling",
      position: "Founder, Prisma",
      avatar: "JS",
      text: "After many recommendations, I finally switched from VSC to Cursor and ... wow! It's absolutely incredible. If you like Copilot (or if you don't), you'll be blown away by Cursor. There is no going back. 🤯"
    },
    {
      name: "Ben Bernard",
      position: "Sr. Staff Engineer, Instacart",
      avatar: "BB",
      text: "Cursor is at least a 2x improvement over Copilot. It's amazing having an AI pair programmer, and is an incredible accelerator for me and my team."
    },
    {
      name: "Andrew McCalip",
      position: "Engineering, Varda Space",
      avatar: "AM",
      text: "Cursor is awesome! Someone finally put AI into a code editor in a seamless way. It's so elegant and easy. I'm an hour in and already hooked."
    },
    {
      name: "Sam Whitmore",
      position: "Engineering, New Computer",
      avatar: "SW",
      text: "started using Cursor yesterday & i'm blown away. it's how Copilot should feel. i'm completely off VSCode now."
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.title}>THE SCENTS</div>
        <nav style={styles.nav}>
          <span style={styles.navItem}>aaaaa</span>
          <span style={styles.navItem}>bbbbb</span>
          <span style={styles.navItem}>ccccc</span>
          <span style={styles.navItem}>ddddd</span>
          <span style={styles.navItem}>eeeee</span>
        </nav>
        <button style={styles.applyButton}>apply</button>
      </header>
      
      <main style={styles.main} ref={sceneRef}></main>

      <section style={styles.teamIntro}>
        <h2 style={styles.teamTitle}>Knows your codebase</h2>
        <p style={styles.teamDescription}>
          Get the best answers from your codebase — or refer to specific files or docs. Use the model's code in one click.
        </p>
        <p style={styles.teamDescription}>
          SINCE 2022
        </p>
      </section>

      <section style={styles.emailForm}>
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for the latest updates.</p>
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
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>▶️</div>
          <h3 style={styles.featureTitle}>Feels Familiar</h3>
          <p style={styles.featureDescription}>
            Import all your extensions, themes, and keybindings in one click.
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔒</div>
          <h3 style={styles.featureTitle}>Privacy & Security</h3>
          <p style={styles.featureDescription}>
            With privacy mode, none of your code is stored by us. Cursor is SOC 2 certified.
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔑</div>
          <h3 style={styles.featureTitle}>Bring Your Own Key</h3>
          <p style={styles.featureDescription}>
            Start out with your API Key. Use our hosted version for the full experience.
          </p>
        </div>
      </section>

      <section style={styles.developerReviews}>
        <h2 style={styles.reviewsTitle}>Loved by Developers</h2>
        <p style={styles.reviewsSubtitle}>We are proud to have helped developers all over the world.</p>
        <div style={styles.reviewsGrid}>
          {reviews.map((review, index) => (
            <div key={index} style={styles.reviewCard}>
              <div style={styles.reviewProfile}>
                <div style={styles.reviewAvatar}>{review.avatar}</div>
                <div>
                  <div style={styles.reviewName}>{review.name}</div>
                  <div style={styles.reviewPosition}>{review.position}</div>
                </div>
              </div>
              <p style={styles.reviewText}>{review.text}</p>
            </div>
          ))}
        </div>

    </section>

<footer style={styles.footer}>
  <div style={styles.footerContent}>
    <div style={styles.footerLogo}>
      <span style={{ marginRight: '0.5rem' }}>▢</span> CURSOR
    </div>
    <div style={styles.footerLinks}>
      <a href="#" style={styles.footerLink}>Pricing</a>
      <a href="#" style={styles.footerLink}>Company</a>
      <a href="#" style={styles.footerLink}>Twitter</a>
      <a href="#" style={styles.footerLink}>Forum</a>
      <a href="#" style={styles.footerLink}>Changelog</a>
      <a href="#" style={styles.footerLink}>GitHub</a>
      <a href="#" style={styles.footerLink}>Careers</a>
      <a href="#" style={styles.footerLink}>Privacy</a>
      <a href="#" style={styles.footerLink}>Blog</a>
      <a href="#" style={styles.footerLink}>Terms</a>
    </div>
    <div style={styles.footerEmail}>hi@cursor.com</div>
  </div>
  <div style={styles.footerBottom}>
    <div>Made by Anysphere</div>
    <div>SOC 2 Certified</div>
  </div>
</footer>
</div>
);
};
export default LandingPage;